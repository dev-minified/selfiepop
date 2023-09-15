import { getUser } from 'api/User';
import { AxiosRequestConfig } from 'axios';
import { COUNTRY_API_EMAIL, COUNTRY_API_KEY, GOOGLE_FONT_KEY } from '../config';
import { getLocalStorage, setLocalStorage } from '../util';
import request, { cancellableRequest } from '../util/request';
import { getAppVersion, healUser } from './app';
import { orderCreate } from './Order';
import { createGuestUser } from './User';
export const fetchCountries = async (universalToken: string) => {
  return await request('/countries', {
    baseURL: 'https://www.universal-tutorial.com/api',
    headers: { Authorization: `Bearer ${universalToken}` },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getUniversalToken = async () => {
  const apiToken = COUNTRY_API_KEY;
  const userEmail = COUNTRY_API_EMAIL;

  return await request('/getaccesstoken', {
    baseURL: 'https://www.universal-tutorial.com/api',
    headers: { 'api-token': apiToken, 'user-email': userEmail },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const fetchStates = async (country: string, universalToken: string) => {
  return await request(`/states/${country}`, {
    baseURL: 'https://www.universal-tutorial.com/api',
    headers: { Authorization: `Bearer ${universalToken}` },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const fetchCities = async (state: string, universalToken: string) => {
  return await request(`/cities/${state}`, {
    baseURL: 'https://www.universal-tutorial.com/api',
    headers: { Authorization: `Bearer ${universalToken}` },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const placeSearch = async (place: string) => {
  return await cancellableRequest(
    'placeSearch',
    `/user/placeSearch/${place}`,
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getIcon = async (url: string) => {
  return await cancellableRequest('getIcon', `/image/social-icon`, {
    params: { platform: url },
  });
};

export const upload = async (
  url: string,
  data: any,
  config: AxiosRequestConfig = {},
  includeAuthHeader: boolean = true,
) => {
  const headers: any = {};
  const gu: any = getLocalStorage('guestTokens');

  if (gu.token) {
    headers['Authorization'] = `Bearer ${gu.token}`;
  }

  return await request(
    url,
    {
      headers,
      data,
      method: 'POST',
      ...config,
    },
    null,
    includeAuthHeader,
  ).then((res) => {
    if (!res || !res?.success) {
      if (res?.reason !== 'cancelled')
        throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getFontList = async () => {
  return await request('/webfonts/v1/webfonts', {
    baseURL: 'https://www.googleapis.com',
    params: { key: GOOGLE_FONT_KEY },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const createOrderWithGuestUser = async (data: any, email = '') => {
  return await orderCreate(data)
    .then(async ({ order }) => {
      const guestUser = await createGuestUser({
        orderId: order._id,
        signupSource: 'checkout',
        email,
      });
      return { order, guestUser };
    })
    .catch((e) => {
      throw new Error(e.message || '');
    });
};

export async function getCounterLabel() {
  return await cancellableRequest('navcounter', `/order/counter`, {
    method: 'GET',
  }).then((res) => {
    if (!res) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
}

export const updateUserFeatures = (
  user: Partial<IUser>,
  setUser: (...args: any) => void,
  avoidchecks = false,
) => {
  const appVersion = getLocalStorage('appversion', true);
  const isAllowedToHeal = avoidchecks || appVersion !== user?.version;
  if (isAllowedToHeal) {
    getAppVersion()
      .then((res) => {
        setLocalStorage('appversion', res.appVersion, false);
        if (res.success && (res.appVersion !== user?.version || avoidchecks)) {
          healUser()
            .then(async (d) => {
              setUser({ ...user, version: d?.version });
              await getUser(user?._id || '').then((res) => setUser(res));
            })
            .catch((e) => {
              // setLocalStorage('appversion', user.version);
              console.log(e);
            });
        }
      })
      .catch((e) => console.log);
  }
};
export const healSpUser = (
  user: IUser,
  setUser: (...args: any) => void,
  callback?: (...args: any[]) => void,
) => {
  healUser()
    .then(async (d) => {
      setUser({ ...user, version: d?.version });
      const updatedUser = await getUser(user?._id || '').then((res) => {
        setUser(res);

        return res;
      });
      callback?.(updatedUser);
    })
    .catch((e) => {
      // setLocalStorage('appversion', user.version);
      console.log(e);
    });
};
