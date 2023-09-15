import { spRefreshToken } from 'api/app';
import { getUser, login, signup, update } from 'api/User';
import dayjs from 'dayjs';
import { Time } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useSocket from 'hooks/useSocket';
import React, { createContext, useCallback, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { resetSubscriptions } from 'store/reducer/chat';
import {
  resetCheckoutStates,
  setGuestUser,
  setGuestUserTokens,
} from 'store/reducer/checkout';
import { resetHeadersCount } from 'store/reducer/counter';
import { restGlobalState } from 'store/reducer/global';
import { reInitializeState } from 'store/reducer/salesState';
import { setSupportChatCount } from 'store/reducer/support';
import { restThemeState } from 'store/reducer/theme';
import { useAnalytics } from 'use-analytics';
import {
  decodeJWT,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from 'util/index';
const cookies = new Cookies();

export const actions = {
  setUser: 'SET_USER',
  toggleLoading: 'TOGGLE_LOADING',
  loggedIn: 'SET_LOGGED_IN',
  isAuthenticated: 'ISAUTHENTICATED',
};

export interface IAuthState {
  user: IUser;
  isAuthenticated?: boolean;
  loggedIn: boolean;
  isInitiallyLoading: boolean;
}
const reducer = (state: IAuthState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case actions.setUser:
      setLocalStorage('user', action.payload);
      return {
        ...state,
        user: action.payload,
        isInitiallyLoading: false,
      };
    case actions.toggleLoading:
      return {
        ...state,
        isLoading: action.payload,
      };
    case actions.loggedIn:
      return {
        ...state,
        loggedIn: action.payload,
      };

    case actions.isAuthenticated:
      return {
        ...state,
        isAuthenticated: action.payload,
        loggedIn: action.payload,
        guestSettled: false,
      };
    default:
      throw new Error(`No case for type ${action.type} found.`);
  }
};

interface IAuthContext extends Partial<IAuthState> {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  options: { loggedIn?: boolean; guestSettled?: boolean };
  Login: Function;
  setLoggedData: Function;
  SignUp: Function;
  Logout: Function;
  setToken: (token: string, refreshToken?: string) => void;
  dispatch?: any;
}

export const Auth = createContext<IAuthContext>({
  user: undefined as any,

  setUser: () => {},
  Login: () => {},
  setLoggedData: () => {},
  SignUp: () => {},
  Logout: () => {},
  setToken: () => {},
  options: {},
});

const AppAuthProvider: React.FC<any> = (props) => {
  const history = useHistory();
  const { socket } = useSocket();
  const analytics = useAnalytics();
  // const { setLoading } = useRequestLoader();
  const [{ user, isAuthenticated, ...rest }, dispatch] = React.useReducer(
    reducer,
    {
      isInitiallyLoading: true,
      isLoading: false,
      loggedIn:
        getLocalStorage('user')?._id && cookies.get('token') ? true : false,
      user: getLocalStorage('user'),
      isAuthenticated: false,
    },
  );

  const appDispatch = useAppDispatch();

  // eslint-disable-next-line
  const setRefreshToken = async () => {
    return new Promise((res) => {
      const gstUser = getLocalStorage('guestUser');
      const gtokens = getLocalStorage('guestTokens');
      const token = cookies.get('token') || gtokens?.token;
      const refreshToken = cookies.get('refreshToken') || gtokens?.refreshToken;
      const checkForToken = !!(gstUser?.data?._id || user?._id) && token;

      if (checkForToken) {
        const jwtToken = decodeJWT(token) as any;
        const jwtExpires = dayjs(jwtToken.exp * 1000).diff(dayjs(), 'minutes');

        if (jwtExpires < 3) {
          spRefreshToken({
            token,
            refreshToken,
            onSuccessCallbak: (response) => {
              const isGuestUser = !user?._id;
              if (isGuestUser) {
                appDispatch(
                  setGuestUser({
                    ...gstUser,
                    token: response.data?.token,
                    refreshToken: response.data?.refreshToken,
                  }),
                );
                appDispatch(
                  setGuestUserTokens({
                    token: response.data?.token,
                    refreshToken: response.data?.refreshToken,
                  }),
                );
                res(true);
                return;
              }
              setToken(response?.data?.token, response?.data?.refreshToken);
              res(true);
            },
            onErrorCallback: () => {
              res(true);
            },
            options: {
              loggedIn: !!user?._id,
            },
          });
        } else {
          res(true);
        }
      } else {
        res(true);
      }
    });
  };
  const getAppUser = () => {
    // setLoading(true);
    getUser(user._id)
      .then(async (res) => {
        // setLoading(false);
        let links = res.links;
        if (res?.tempLinks && !!res?.tempLinks?.length) {
          links = [
            ...res.links,
            ...(res.tempLinks || []).map((link: any) => ({
              ...link,
              isTemp: true,
            })),
          ];
          try {
            await update({ ...res, links }, null, {
              ignoreStatusCodes: [422],
            });
          } catch (error) {}
        }
        dispatch({
          type: actions.setUser,
          payload: { ...res, links },
        });
        dispatch({ type: actions.isAuthenticated, payload: true });
      })
      .catch(() => {
        // setLoading(false);
        dispatch({ type: actions.setUser, payload: undefined });
        dispatch({ type: actions.isAuthenticated, payload: false });
        cookies.remove('token', { path: '/' });
        removeLocalStorage('user');
      });
  };
  useEffect(() => {
    //check if authicated
    if (rest.loggedIn) {
      getAppUser();
    }
  }, []);
  const LogInDetails = useCallback(async (res: any, callBack: any) => {
    const { data, token, refreshToken } = res;

    setToken(token, refreshToken);
    removeLocalStorage('guestUser');
    removeLocalStorage('guestTokens');
    let links = data.links;
    if (data?.tempLinks && !!data?.tempLinks?.length) {
      links = [
        ...data.links,
        ...(data.tempLinks || []).map((link: any) => ({
          ...link,
          isTemp: true,
        })),
      ];
      await update({ ...res.data, links, tempLinks: null }, null, {
        ignoreStatusCodes: [422],
      }).catch(() => {});
    }
    dispatch({
      type: actions.setUser,
      payload: { ...data, tempLinks: null, links },
    });
    dispatch({ type: actions.isAuthenticated, payload: true });
    analytics.identify(data?._id);
    analytics.track('logIn', {
      name: data?.firstName,
    });
    callBack?.(data);
    return data;
  }, []);
  const Login = useCallback(
    (credientials: any) => {
      return login(credientials).then(async (res: any) => {
        return LogInDetails(res, () => {
          if (socket?.io) {
            socket?.disconnect();
            socket?.connect();
            socket.io.opts.extraHeaders = {
              ...socket.io.opts.extraHeaders,
              token: cookies.get('token'),
            };
            socket?.emit('login');
          }
        });
      });
    },
    [dispatch, socket],
  );

  const setToken = useCallback((token: string, refreshToken?: string) => {
    cookies.set('token', token, {
      path: '/',
      maxAge: 68 * Time.YEARS,
      sameSite: false,
    });
    if (!!refreshToken) {
      cookies.set('refreshToken', refreshToken, {
        path: '/',
        maxAge: 68 * Time.YEARS * 10,
        sameSite: false,
      });
    }
  }, []);

  const SignUp = useCallback(
    (data: any) => {
      return signup(data)
        .then(async (res: any) => {
          const { data, token, refreshToken } = res;
          setToken(token, refreshToken);
          dispatch({ type: actions.setUser, payload: data });
          dispatch({ type: actions.isAuthenticated, payload: true });
          analytics.identify(data?._id || '');
          analytics.track('new_registration_started', {
            UserName: `${data.firstName} ${data.lastName}`,
            onboardingFlowTypeId: data?.onboardingTypeId,
            flowVersion: 1,
            url: `${window.location.protocol}//${window.location.host}/verify-email`,
          });
          return data;
        })
        .catch((e: Error) => {
          //TODO: Handle Error case
          throw e;
        });
    },
    [dispatch],
  );

  const setUser = (value: any) => {
    const updatedUser = typeof value === 'function' ? value(user) : value;
    dispatch({ type: actions.setUser, payload: updatedUser });
  };

  const Logout = useCallback(
    async (allowRedirect = true) => {
      return new Promise((resolve, reject) => {
        try {
          analytics.track('logout', {
            name: user?.firstName,
            userId: user?._id,
          });
          removeLocalStorage('user');
          removeLocalStorage('guestTokens');
          cookies.remove('token', { path: '/' });
          cookies.remove('refreshToken', { path: '/' });
          appDispatch(setSupportChatCount({ totalComments: 0 }));
          appDispatch(resetSubscriptions({}));
          appDispatch(reInitializeState());
          appDispatch(resetHeadersCount());
          removeLocalStorage('appversion');
          dispatch({ type: actions.setUser, payload: undefined });
          dispatch({ type: actions.isAuthenticated, payload: false });
          appDispatch(restThemeState());
          appDispatch(restGlobalState());
          appDispatch(resetCheckoutStates());
          analytics.storage.removeItem('__user_id');

          socket?.emit('logout');
          if (allowRedirect) {
            history.replace('/login');
          }

          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    },
    [dispatch, socket, user?._id],
  );
  return (
    <Auth.Provider
      value={{
        user,
        isAuthenticated,
        setUser,
        Login,
        SignUp,
        Logout,
        setToken,
        setLoggedData: LogInDetails,
        options: rest,
        dispatch,
        ...rest,
      }}
    >
      {/* {loading ? null : props.children} */}
      {props.children}
    </Auth.Provider>
  );
};

export default AppAuthProvider;
