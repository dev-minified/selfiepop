import { AxiosRequestConfig } from 'axios';
import { stringify } from 'querystring';
import request, { cancellableRequest } from '../util/request';

export const orderCreate = async (data: any) => {
  return await request('/order', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const SubmitOrderReview = async (data: {
  orderId: string;
  rate: number;
  review?: string;
}) => {
  return await request('/order/accept-order', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const raiseDispute = async (data: { orderId: string }) => {
  return await request('/order/raised-dispute', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getOrder = async (
  orderId: string,
  cookies: any = null,
  customError?: Record<string, any>,
) => {
  return request(
    `/order/${orderId}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    cookies,
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

export const getOrders = async (params: any, customError?: CustomErrorType) => {
  return request(
    `/order?${stringify(params)}`,
    {
      method: 'GET',
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
export const getUnlockedOrders = async (
  params: any,
  customError?: CustomErrorType,
) => {
  return request(
    `/order/members-orders?${stringify(params)}`,
    {
      method: 'GET',
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
export const getOrdersList = async (
  params: any,
  options?: AxiosRequestConfig,
) => {
  return cancellableRequest(
    'order-list',
    `/order/subscription-order-list?${stringify(params)}`,
    {
      ...options,
      method: 'GET',
    },
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getProfileOrdersList = async (
  params: any,
  options?: AxiosRequestConfig,
) => {
  return cancellableRequest(
    'order-list',
    `/order/subscription-order-list?${stringify(params)}`,
    {
      ...options,
      method: 'GET',
    },
  ).then((res: any) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const checkOrderExists = async (
  popId: string,
  options?: AxiosRequestConfig,
) => {
  return cancellableRequest(
    'check-order-exists',
    `/order/check/chat-already-buy/${popId}`,
    {
      ...options,
      method: 'GET',
    },
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getUserOrders = async (
  userId: string,
  params: any,
  customError?: { ignoreStatusCodes: number[] },
) => {
  return cancellableRequest(
    'order/usersorders',
    `/order/order-details/${userId}?${stringify(params)}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getUserNotPurchaseServices = async (
  userId: string,
  params: any,
) => {
  return cancellableRequest(
    'UserNotPurchaseServices',
    `/user/not/purchase/${userId}?${stringify(params)}`,
    {
      method: 'GET',
    },
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getUserNotPurchaseCourse = async (userId: string, params: any) => {
  return cancellableRequest(
    'UserNotPurchaseCourse',
    `/user/not/purchase/${userId}?${stringify(params)}`,
    {
      method: 'GET',
    },
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateOrder = async (orderId: string, data: any) => {
  return request(`/order/${orderId}`, {
    data,
    method: 'PUT',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateOrderPayma = async (data: any) => {
  return request('/order/status/payma/update', {
    data,
    method: 'PUT',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateOrderStatus = async (data: any) => {
  return request('/order/status/update', {
    data,
    method: 'PUT',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const submitOrder = async (data: any) => {
  return request('/order/status/other/update', {
    data,
    method: 'PUT',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const refuseOrder = async (orderId: string) => {
  return request(`/order/cancel-order/${orderId}`, { method: 'PUT' }).then(
    (res: any) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const orderQuestionAnswer = async (orderId: string, message: string) => {
  return request(`/order/question-and-answer/${orderId}`, {
    method: 'POST',
    data: { message },
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};

export const getSellerDetails = async (orderId: string) => {
  return request(
    `/order/seller-details/${orderId}`,
    {
      method: 'GET',
    },
    null,
    false,
  ).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};

export const getOrderVideo = async (orderId: string) => {
  return request(
    `/order/get-video/${orderId}`,
    {
      method: 'GET',
    },
    null,
    true,
    false,
  ).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};

export const shareOrderVideo = async (
  orderId: string,
  { name, message, email }: { name: string; email: string; message: string },
) => {
  return request(`/order/share/${orderId}`, {
    method: 'POST',
    data: { name, email, message },
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};

export const acceptAdvertisementRequest = async (
  orderId: string,
  data: { startDateTime: string; endDateTime: string },
) => {
  return request(`/order/conversation/accept/${orderId}`, {
    method: 'POST',
    data,
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};
