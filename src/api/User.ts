import { IAxiosConfig } from 'types/IAxios';
import { getCookieByName, getLocalStorage } from 'util/index';
import request, { cancellableRequest } from '../util/request';
export const getUser = async (id: string) => {
  return await request(`/user/${id}`).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const checkUserName = async (username: string) => {
  return await cancellableRequest(
    'checkUserName',
    `/user/check-username/${username}`,
    {},
    null,
    false,
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const createUserLinks = async (data: any) => {
  return await request('/user/create-user-links', {
    method: 'POST',
    data: data,
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const login = async (billingMethodData: any) => {
  return await request('/auth/login', {
    method: 'POST',
    data: billingMethodData,
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const verifyPassword = async (values: any) => {
  return await request('/user/password-verify', {
    method: 'POST',
    data: values,
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const signup = async (data: any) => {
  return request('/auth/signup', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const sentRestPasswordLink = async (
  email: any,
  customError?: CustomErrorType,
) => {
  return await request(
    '/auth/forgot-password',
    {
      method: 'POST',
      data: {
        email,
        frontendURL: `${window.location.protocol}//${window.location.host}/reset-password`,
      },
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
    true,
    '',
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const sendEmailVerificationLink = async (email: any) => {
  return await request('/auth/verification-code', {
    method: 'POST',
    data: {
      email,
      frontendURL: `${window.location.protocol}//${window.location.host}/verify-email`,
    },
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const resetPassword = async (data: any) => {
  return await request('/auth/reset-password', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const activateAccountRequest = async (data: any) => {
  return await request('/auth/reactvate-request', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const reActivateAccount = async (data: any) => {
  return await request('/auth/reactvate-account', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const deactivateAccount = async () => {
  return await request('/user/deactivate', {
    method: 'DELETE',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const verifyToken = async (data: any) => {
  return await request('/auth/verify-token', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
  // .catch((e) => console.log(e));
};

export const verifyAccount = async (data: any) => {
  return await request(
    '/auth/verify-account',
    {
      data,
      method: 'POST',
    },
    null,
    true,
    false,
  );
};
export const update = async (
  user: any,
  cookies = null,
  errorConfig?: CustomErrorType,
) => {
  return await request(
    '/user?populate=themeColor',
    {
      method: 'PUT',
      data: user,
      errorConfig: {
        ignoreStatusCodes: errorConfig?.ignoreStatusCodes || [],
      },
    },
    cookies,
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateGuestUser = async (user: any, token?: string) => {
  const headers: any = {};
  const gTokens: any = getLocalStorage('guestTokens');
  if (!token && !gTokens.token) {
    throw new Error('Guest user not available');
  }

  headers['Authorization'] = `Bearer ${token || gTokens.token}`;

  return await request('/user', {
    headers,
    method: 'PUT',
    data: user,
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const createLinks = async (token: string) => {
  if (!token) {
    throw new Error('Guest user not available');
  }

  return await request('/user/create-user-links', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const createGuestUser = async (user: any) => {
  return await request('/user/create-user', {
    method: 'POST',
    data: user,
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getAffliatedData = async (params?: {
  skip?: number;
  limit?: number;
  sort?: string;
  order?: number;
}) => {
  return request('/user/affiliate-notifications', { params }).then(
    (res: any) => {
      if (!res.success) {
        throw new Error(res.data.message);
      }
      return res;
    },
  );
};

export const pushIntoUser = async (
  id: string = '',
  value: any,
  cookies: any = null,
) => {
  if (!id) {
    return;
  }
  return await request(
    `/user/push/${id}`,
    {
      method: 'PUT',
      data: value,
    },
    cookies,
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const pullFromUser = async (
  id: string,
  value: {
    name: string;
    id: string;
  },
) => {
  return await request(`/user/pull/${id}`, {
    method: 'PUT',
    data: value,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateSorting = async (value: any) => {
  return await request('/user/update-sorting', {
    method: 'PUT',
    data: value,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateNestedAttribute = async (id: string = '', value: any) => {
  if (!id) {
    return;
  }
  return await request(`/user/update-nested-attribute/${id}`, {
    method: 'PUT',
    data: value,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const deleteLink = async (id: string) => {
  return await request('/user/delete/link', {
    method: 'DELETE',
    data: { id },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const fetchUserByName = async (
  userName: string,
  params: { [key: string]: any } = {},
  options: Partial<IAxiosConfig> = {},
  handleError = true,
) => {
  return request(
    `/user/user-name/${userName}`,
    { params, ...options },
    null,
    true,
    handleError,
  ).then((res) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const findUserByName = async (
  userName: string,
  params: any = {},
  handleError = true,
) => {
  return request(
    `/user/user-name/${userName}`,
    params,
    null,
    true,
    handleError,
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getPresignedUrl = async (
  key: string,
  type: string,
  isVideo = true,
) => {
  let url = `pops/order-videos/${key}`;
  if (!isVideo) {
    url = `pops/media/${key}`;
  }
  return request('/auth/get-presigned-url', {
    method: 'POST',
    data: {
      type,
      key: url,
    },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const checkUserProfile = async (
  token: string,
  errorConfig?: CustomErrorType,
) => {
  return await request('/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'GET',
    errorConfig,
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updatePhoneNumber = async (
  phoneNumber?: string,
  token?: string,
) => {
  const headers: any = {};

  const gu: any = getLocalStorage('guestTokens');
  let cookie = getCookieByName('token');
  if (!token && !gu?.token && !cookie) {
    throw new Error('Guest user not available');
  }

  headers['Authorization'] = `Bearer ${token || gu.token || cookie}`;
  return await request('/user/phone', {
    headers,
    method: 'POST',
    data: { phone: phoneNumber },
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const verifyPhoneOTP = async (code?: string, token?: string) => {
  const headers: any = {};
  const gu: any = getLocalStorage('guestTokens')?.token
    ? getLocalStorage('guestTokens')
    : {
        token: getCookieByName('token'),
      };
  if (!token && !gu.token) {
    throw new Error('Guest user not available');
  }

  headers['Authorization'] = `Bearer ${token || gu.token}`;
  return await request('/user/phone/verify', {
    headers,
    method: 'POST',
    data: { code },
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createVerificationSession = async () => {
  return request('/auth/create-verification-session', {
    method: 'GET',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
