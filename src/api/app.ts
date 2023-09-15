// /heal/app - version;

import { loadStripe } from '@stripe/stripe-js';
import { default as axiosRefresh } from 'axios';
import { API_URL, STRIPE_PUBLIC_KEY } from 'config';
import { Time } from 'enums';
import { stringify } from 'querystring';
import { Cookies } from 'react-cookie';
import { onCardModalOpen } from 'store/reducer/cardModal';
import { AppDispatch } from 'store/store';
import analytics from 'util/analytics';
import request, { cancellableRequest } from '../util/request';
const baseURL = API_URL?.concat('/api');
const cookies = new Cookies();
const axiosInstance = axiosRefresh.create({
  baseURL: baseURL,
});
const apikey = STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(apikey === undefined ? '' : apikey);
export const confirmCardPayment = async (
  secret: Record<string, any>,
  dispatch?: AppDispatch,
  onErrorCallback?: (...args: any) => void | Promise<any>,
) => {
  const title = 'Oops! We ran into some problems';
  const stripe = await stripePromise;

  return await stripe?.confirmCardPayment(secret.client_secret).then((res) => {
    if (res.error) {
      dispatch?.(onCardModalOpen());
      analytics.track('react_error', {
        messge: res.error.message,
        title,
        url: window.location.href,
      });
      onErrorCallback?.(res);
      throw new Error(res.error.message);
    }
    return res;
  });
};
export const getAppVersion = async () => {
  return cancellableRequest(
    'app-version',
    `/heal/app-version`,
    {
      method: 'GET',
      errorConfig: {
        ignoreStatusCodes: [404],
      },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const getManagedPendingRequests = async () => {
  return cancellableRequest(
    'managed-count',
    `/user/managed/count`,
    {
      method: 'GET',
      errorConfig: {
        ignoreStatusCodes: [404],
      },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res.success) {
      throw new Error(res?.data?.message);
    }
    return res;
  });
};
export const sendLogs = async (data: any) => {
  return request(`/logging`, {
    method: 'POST',
    data,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res;
  });
};
export const getPublicLogs = async (params?: Record<string, any>) => {
  return request(`/logging/get-data-by-range?${stringify(params)}`, {
    method: 'GET',
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res;
  });
};
export const healUser = async () => {
  return request(`/heal/`, {
    method: 'GET',
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res;
  });
};
type IRefreshTokenType = {
  token?: string;
  refreshToken?: string;
  onSuccessCallbak?: (...args: any) => void;
  onErrorCallback?: (...args: any) => void;
  onFinally?: (...args: any) => void;
  options?: Record<string, any>;
};
export const spRefreshToken = async (props: IRefreshTokenType) => {
  const {
    token,
    refreshToken,
    onSuccessCallbak,
    onFinally,
    onErrorCallback,
    options = {},
  } = props;
  const { loggedIn = true } = options;
  return axiosInstance
    .post('/auth/refresh', {
      token: cookies.get('token') || token,
      refreshToken: cookies.get('refreshToken') || refreshToken,
    })
    .then((response) => {
      if (response?.data?.status && loggedIn) {
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
      onSuccessCallbak?.(response);
    })
    .catch((e) => {
      onErrorCallback?.(e);
    })
    .finally(() => {
      onFinally?.();
    });
};
export const refreshAppAuthToken = async (props: IRefreshTokenType) => {
  const { token, refreshToken } = props;

  return axiosInstance.post('/auth/refresh', {
    token: cookies.get('token') || token,
    refreshToken: cookies.get('refreshToken') || refreshToken,
  });
};
