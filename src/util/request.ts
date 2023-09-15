import { refreshAppAuthToken, spRefreshToken } from 'api/app';
import { AxiosRequestConfig, default as axios } from 'axios';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import { Time } from 'enums';
import { createBrowserHistory } from 'history';
import { Cookies } from 'react-cookie';
import { setGuestUser, setGuestUserTokens } from 'store/reducer/checkout';
import { store } from 'store/store';
import { IAxiosConfig } from 'types/IAxios';
import { decodeJWT, getLocalStorage, removeLocalStorage } from 'util/index';
import { API_URL } from '../config';
import analytics from './analytics';

const cookies = new Cookies();
let isRefreshTokenSent = false;
export let requestsToRefresh: any = [];
export let totalRequestSending = 0;
const INTERVAL_MS = 10;
export let isRefreshTokenSent1 = false;
let requestConfigoboject: any = {};
const baseURL = API_URL?.concat('/api');

const CancelToken = axios.CancelToken;
const pendingRequests = new Map();
// type IAxiosConfig = AxiosRequestConfig & {
//   errorConfig?: {
//     ignoreStatusCodes?: number[];
//   };
//   sendlogs?: boolean;
// };

axios.interceptors.request.use(
  async (config) => {
    let jwtToken = cookies.get('token');
    const user = getLocalStorage('user');
    let gtokens: any;
    if (!user?._id) {
      gtokens = getLocalStorage('guestTokens');
    }
    let token = !!user?._id ? cookies.get('token') : gtokens?.token;
    let refreshToken = !!user?._id
      ? cookies.get('refreshToken')
      : gtokens?.refreshToken;

    // get request config object
    const includeAuthHead =
      requestConfigoboject[config?.url || '']?.includeAuthHeader;
    // check if token and refresh token doesn't exist return normal config
    if (!!token && !!refreshToken) {
      const isLoggedIn = !!user?._id;

      // decode jwt to check the expiration time
      jwtToken = decodeJWT(token) as any;
      const jwtExpires = dayjs(jwtToken?.exp * 1000).diff(
        dayjs(),
        // 'hours',
        'minutes',
      );

      // check if refresh token needed
      const allowToRefresh = jwtExpires < 2 && includeAuthHead;
      if (allowToRefresh && !(window as any).isRefreshTokenRequestSent) {
        (window as any).isRefreshTokenRequestSent = true;

        refreshAppAuthToken({
          token,
          refreshToken,
        })
          .then((response) => {
            // set cookie in browser cookies if logged in
            if (response?.data?.status && isLoggedIn) {
              cookies.set('token', response.data.token, {
                path: '/',
                maxAge: 68 * Time.YEARS,
                sameSite: false,
              });
              cookies.set('refreshToken', response.data.refreshToken, {
                path: '/',
                maxAge: 68 * Time.YEARS * 10,
                sameSite: false,
              });
            }
            // set cookie in localstorage for guest usre and dispatch storage event
            if (!isLoggedIn && !!gtokens?.token) {
              store.dispatch(setGuestUser(user));
              store.dispatch(
                setGuestUserTokens({
                  token: response?.data?.token,
                  refreshToken: response?.data?.refreshToken,
                }),
              );
              // setGuestTokens('guestTokens', {
              //   token: response?.data?.token,
              //   refreshToken: response?.data?.refreshToken,
              // });
            }
            (window as any).isRefreshTokenRequestSent = false;
          })
          .catch(() => {
            (window as any).isRefreshTokenRequestSent = false;
            console.log('errror');
          });
      }
    }
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        let gtokens = getLocalStorage('guestTokens');
        const user = getLocalStorage('user');
        let token = !!user?._id ? cookies.get('token') : gtokens?.token;

        const isRefreshRequestSent = (window as any).isRefreshTokenRequestSent;
        if (!isRefreshRequestSent) {
          clearInterval(interval);
          if (includeAuthHead && !!token) {
            config.headers.Authorization = `Bearer ` + token;
          }
          resolve(config);
        }
      }, INTERVAL_MS);
    });
    // try {
    //   // get token from cookie and users(regular and guest)
    //   let jwtToken = cookies.get('token');
    //   const user = getLocalStorage('user');
    //   let guestUser;
    //   if (!user?._id) {
    //     guestUser = getLocalStorage('guestUser');
    //   }
    //   let token = !!user?._id ? cookies.get('token') : guestUser?.token;
    //   let refreshToken = !!user?._id
    //     ? cookies.get('refreshToken')
    //     : guestUser?.refreshToken;
    //   // check if token and refresh token doesn't exist return normal config
    //   if (!!token && !!refreshToken) {
    //     const isLoggedIn = !!user?._id;

    //     // decode jwt to check the expiration time
    //     jwtToken = decodeJWT(token) as any;
    //     const jwtExpires = dayjs(jwtToken?.exp * 1000).diff(
    //       dayjs(),
    //       // 'hours',
    //       'minutes',
    //     );
    //     // get request config object
    //     const includeAuthHead =
    //       requestConfigoboject[config?.url || '']?.includeAuthHeader;

    //     // check if refresh token needed
    //     const allowToRefresh = jwtExpires < 2 && includeAuthHead;
    //     if (allowToRefresh) {
    //       const response = await refreshAppAuthToken({
    //         token,
    //         refreshToken,
    //       });
    //       // set cookie in browser cookies if logged in
    //       if (response?.data?.status && isLoggedIn) {
    //         cookies.set('token', response.data.token, {
    //           path: '/',
    //           maxAge: 68 * Time.YEARS,
    //           sameSite: false,
    //         });
    //         cookies.set('refreshToken', response.data.refreshToken, {
    //           path: '/',
    //           maxAge: 68 * Time.YEARS * 10,
    //           sameSite: false,
    //         });
    //       }
    //       // set cookie in localstorage for guest usre and dispatch storage event
    //       if (!isLoggedIn && guestUser?.data?._id) {
    //         setGuestStorage('guestUser', {
    //           ...guestUser,
    //           token: response?.data?.token,
    //           refreshToken: response?.data?.refreshToken,
    //         });
    //       }
    //       // set token in the request headers
    //       if (!!config?.headers?.Authorization || includeAuthHead) {
    //         config.headers.Authorization = `Bearer ${response?.data?.token}`;
    //       }
    //     }
    //   }
    //   return config;
    // } catch (error) {
    //   return config;
    // }
  },
  (error) => {
    return Promise.reject(error);
  },
);
axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  async (error = {}) => {
    const { status, config, data } = error.response || {};
    const { url } = config || {};
    // if (!cookies.get('token')) {
    //   return Promise.reject(error);
    // }
    if (status === 401 && data?.message === 'jwt expired') {
      if (!(window as any).isRefreshTokenRequestSent) {
        (window as any).isRefreshTokenRequestSent = true;
        isRefreshTokenSent = true;
        spRefreshToken({
          token: '',
          refreshToken: '',
          onSuccessCallbak: (response) => {
            if (response?.data?.status) {
              requestsToRefresh.forEach((cb: any) => cb(response.data.token));
            }
          },
          onErrorCallback: () => {
            requestsToRefresh.forEach((cb: any) => cb(null));
            removeLocalStorage('user');
            cookies.remove('token', { path: '/' });
            cookies.remove('refreshToken', { path: '/' });
            createBrowserHistory().push('/');
            window.location.reload();
            requestsToRefresh = [];
            (window as any).isRefreshTokenRequestSent = false;
          },
          onFinally: () => {
            requestsToRefresh = [];
            totalRequestSending = 0;
            (window as any).isRefreshTokenRequestSent = false;
          },
        });
      }
      return new Promise((resolve, reject) => {
        // In our variable (requests that expect a new token
        // from the first request), we add a callback,
        // which the first request to execute
        requestsToRefresh.push((token: string) => {
          if (token) {
            const includeAuthHead =
              requestConfigoboject[config?.url || '']?.includeAuthHeader;
            if (!!includeAuthHead) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            resolve(refreshAfterRequests(config));
          }

          // If the first request could not update the token, we
          // must return the basic request processing logic
          // reject(error);
        });
      });
    } else if (status === 401) {
      if (url.includes('/api/order/get-video')) {
        return Promise.reject(error);
      }
      removeLocalStorage('user');
      cookies.remove('token', { path: '/' });
      cookies.remove('refreshToken', { path: '/' });
      createBrowserHistory().push('/');
      window.location.reload();
      requestsToRefresh = [];
      totalRequestSending = 0;
      isRefreshTokenSent = false;
    }

    return Promise.reject(error);
  },
);

const codeMessage: { [key: string]: string } = {
  200: 'The request has succeeded',
  201: 'New resource has been created ',
  202: 'The request has been received',
  204: 'No Content',
  // 400: 'The server could not understand the request due to invalid syntax.',
  401: 'Unauthorized Operation',
  403: 'You do not have access rights to the content',
  404: 'Not Found',
  406: 'Not Acceptable',
  410: 'The request content is not longer available',
  422: 'The request was well-formed but was unable to be followed due to semantic errors.',
  500: "The server has encountered a situation it doesn't know how to handle",
  502: 'Bad Gateway',
  503: 'The server is not ready to handle the request',
  504: 'Timeout',
};

type CustomResponse = {
  success?: boolean;
  errorHandled?: boolean;
  reason?: string;
  cancelled?: boolean;
  data?: Record<string, any>;
} & Partial<Response>;

const errorHandler = (
  error: { response: CustomResponse },
  errorConfig: {
    ignoreStatusCodes?: number[];
  } = {},
): CustomResponse => {
  const { ignoreStatusCodes = [] } = errorConfig;
  if (error instanceof axios.Cancel) {
    return {
      success: false,
      errorHandled: true,
      reason: 'cancelled',
      cancelled: true,
      data: { message: 'Request cancelled' },
      ...error,
    };
  }

  const { response } = error;
  const isServer = typeof window === 'undefined';
  if (isServer) {
    response.success = false;
    return response;
  }
  if (
    response &&
    response.status &&
    !ignoreStatusCodes.includes(response.status) &&
    codeMessage[response.status]
  ) {
    response.success = false;
    response.errorHandled = true;
    const errorText = codeMessage[response.status] || response.statusText;
    toast.error(errorText || 'Sorry something went wrong');
  } else if (!response) {
    toast.error('Please check your internet connection');
    return {
      success: false,
      errorHandled: true,
      reason: 'offnetwork',
      data: { message: 'Internet connection error' },
    };
  }
  return {
    ...response,
    success: false,
    errorHandled: true,
    reason: 'network',
  };
};

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 *
 * Note Don't add anymore params if needed add a object type called 'extra' or something
 * can tell me what's the need for includeAuthHead?
 */

export async function refreshAfterRequests(config: AxiosRequestConfig) {
  const {
    sendlogs,
    options = {},
    handleError,
    errorConfig = {},
  } = requestConfigoboject[config?.url || ''];
  return axios(config)
    .then((json) => {
      delete requestConfigoboject[config.url || ''];
      totalRequestSending -= 1;
      if (json?.data?.length > -1) {
        return { success: true, data: json.data };
      }
      return { success: true, ...json?.data };
    })
    .catch((e) => {
      delete requestConfigoboject[config.url || ''];
      const nweopts = { ...options };
      delete nweopts?.data?.password;
      totalRequestSending -= 1;
      if (sendlogs) {
        // const requestData = {
        //   url: (options.baseURL || baseURL) + url,
        //   options: opts,
        // };

        if (!(e instanceof axios.Cancel)) {
          const { response = {} } = e || {};
          analytics
            .track('react_error', {
              message:
                response?.data?.message ||
                response?.message ||
                e?.message ||
                'Sorry something went wrong',
              location: window?.location?.href,
              url: config.url,
              options: nweopts,
              // requestData: requestData,
              status: response?.status,
            })
            .catch((e) => console.log(e));
        }
      }
      if (handleError) {
        return errorHandler(e, errorConfig);
      } else {
        throw e;
      }
    });
}

export const request = async (
  url: string,
  options: IAxiosConfig = {},
  _ = null,
  includeAuthHeader = true,
  handleError = true,
  token: string = '',
) => {
  const headers: any = {};
  if (includeAuthHeader && (cookies.get('token') || token)) {
    headers['Authorization'] = token
      ? `Bearer ${token}`
      : `Bearer ${cookies.get('token')}`;
  }
  if (cookies.get('visitor')) {
    headers['visitor'] = cookies.get('visitor');
  }
  const { errorConfig = {}, sendlogs = true, ...rest } = options;
  let opts = rest;
  const reqUrl = (options.baseURL || baseURL) + url;

  totalRequestSending += 1;

  opts = {
    ...opts,

    headers: { ...headers, ...options.headers },
  };
  requestConfigoboject[reqUrl] = {
    url,
    options: opts,
    _,
    includeAuthHeader,
    handleError,
    token,
    sendlogs,
    errorConfig,
  };

  return axios(reqUrl, opts)
    .then((json) => {
      delete requestConfigoboject[reqUrl];
      totalRequestSending -= 1;
      if (json?.data?.length > -1) {
        return { success: true, data: json.data };
      }
      return { success: true, ...json?.data };
    })
    .catch((e) => {
      // delete requestConfigoboject[reqUrl];
      totalRequestSending -= 1;
      if (sendlogs) {
        // const requestData = {
        //   url: (options.baseURL || baseURL) + url,
        //   options: opts,
        // };

        if (!(e instanceof axios.Cancel)) {
          const newopts = { ...(opts || {}) };
          delete newopts?.data?.password;
          const { response = {} } = e || {};
          analytics
            .track('react_error', {
              message:
                response?.data?.message ||
                response?.message ||
                e?.message ||
                'Sorry something went wrong',
              location: window?.location?.href,
              url: (options?.baseURL || baseURL) + url,
              options: newopts,
              // requestData: requestData,
              status: response?.status,
            })
            .catch((e) => console.log(e));
        }
      }
      if (handleError) {
        return errorHandler(e, errorConfig);
      } else {
        throw e;
      }
    });
};

export const cancellableRequest = async (
  requestId: string,
  url: string,
  options: IAxiosConfig = {},
  cookies = null,
  handleError = true,
) => {
  if (pendingRequests.has(requestId)) {
    pendingRequests.get(requestId).cancel();
    pendingRequests.delete(requestId);
  }

  const cancelToken = new CancelToken((cancel) => {
    pendingRequests.set(requestId, { url, cancel });
  });
  return await request(
    url,
    {
      cancelToken,
      ...options,
    },
    cookies,
    true,
    handleError,
    '',
  ).then((response) => {
    if (
      response?.success ||
      (!response?.success && response?.reason !== 'cancelled')
    ) {
      pendingRequests.delete(requestId);
    }
    return response;
  });
};

export default request;
