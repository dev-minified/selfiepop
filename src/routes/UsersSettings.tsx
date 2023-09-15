import { fetchCards } from 'api/billing';
import { healSpUser, updateUserFeatures } from 'api/Utils';
import { useAppDispatch } from 'hooks/useAppDispatch';
// import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import useSocket from 'hooks/useSocket';
import { useEffect, useRef } from 'react';
import { Cookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import { setPrimaryCard, setUserCards } from 'store/reducer/global';
import { useAnalytics } from 'use-analytics';
import { parseJwt, setLocalStorage } from 'util/index';
const cookies = new Cookies();

const UsersSettings = () => {
  const { user, setUser, loggedIn, Logout } = useAuth();
  const location = useLocation();
  const analytics = useAnalytics();
  const userRef = useRef<string>();
  const dispatch = useAppDispatch();
  const { token, refreshToken } = useQuery();

  const isRefreshtoken = !!token && !!refreshToken;
  const { socket } = useSocket();
  const performActions = () => {
    const isAlreadyexist = analytics.storage.getItem('__user_id') !== user?._id;
    if (isAlreadyexist) {
      analytics.identify(user?._id || '');
    }
    updateUserFeatures(user, setUser);
  };
  useEffect(() => {
    if (user?._id && userRef.current !== user?._id && !user.isGuest) {
      userRef.current = user?._id;

      const cookie = parseJwt(cookies.get('token') || '');
      if (cookie?.iat) {
        // const isBefore = dayjs(cookie.iat * 1000).isBefore(dayjs('09/23/2022'));
        // if (isBefore) {
        //   Logout();
        // } else {
        //   const isAlreadyexist =
        //     analytics.storage.getItem('__user_id') !== user?._id;
        //   if (isAlreadyexist) {
        //     analytics.identify(user?._id);
        //   }
        //   updateUserFeatures(user, setUser);
        // }

        performActions();
      }
    } else if (!user?._id && userRef.current) {
      userRef.current = undefined;
    }
  }, [user?._id, location?.pathname]);
  const fetchBillingCards = async () => {
    // FIXME: In case on guest user there no Stripe Customer ID
    try {
      const response = await fetchCards({
        ignoreStatusCodes: [500],
      });
      dispatch(setUserCards(response?.sources || []));
      dispatch(
        setPrimaryCard(
          response?.sources.find((item: any) => item.isPrimary) || {},
        ),
      );

      return response;
    } catch (error) {}
  };
  useEffect(() => {
    if (user?._id && loggedIn && !isRefreshtoken) {
      fetchBillingCards();
    }
  }, [user?._id, loggedIn]);

  useEffect(() => {
    if (user?._id && loggedIn && !isRefreshtoken) {
      socket?.on('APP_VERSION', (data) => {
        const newAppversion = Number(data?.version);
        setLocalStorage('appversion', newAppversion);
        if (newAppversion !== user.version) {
          healSpUser(user, setUser);
        }
      });
      socket?.on(user?._id, (data) => {
        if (data.type === 'logout') {
          Logout();
        }
      });
      return () => {
        socket?.off('APP_VERSION');
        socket?.off(user?._id);
      };
    }
  }, [user, socket]);

  return null;
};

export default UsersSettings;
