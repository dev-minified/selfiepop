import { AxiosRequestConfig } from 'axios';
import { stringify } from 'querystring';
import { AppDispatch } from 'store/store';
import { IAxiosConfig } from 'types/IAxios';
import request, { cancellableRequest } from 'util/request';
import { confirmCardPayment } from './app';

export const setPinPost = async (
  id: string,
  sellerId?: Record<string, any>,
  ignoreStatusCodes?: CustomErrorType,
) => {
  return await cancellableRequest(
    'post/setPinPost',
    `/post/pin/${id}${sellerId ? `?${stringify(sellerId)}` : ''}`,
    {
      method: 'GET',
      errorConfig: {
        ignoreStatusCodes: ignoreStatusCodes?.ignoreStatusCodes,
      },
    },
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getUserPinPost = async (
  id: string,
  ignoreStatusCodes?: CustomErrorType,
) => {
  return await cancellableRequest('post/list/pin', `/post/pin/list/${id}`, {
    method: 'GET',
    errorConfig: {
      ignoreStatusCodes: ignoreStatusCodes?.ignoreStatusCodes,
    },
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const unPinPostOnWall = async (
  id: string,
  sellerId?: Record<string, any>,
  ignoreStatusCodes?: CustomErrorType,
) => {
  return await cancellableRequest(
    'post/unPinPostOnWall',
    `/post/unpin/${id}?${stringify(sellerId)}`,
    {
      method: 'DELETE',
      errorConfig: {
        ignoreStatusCodes: ignoreStatusCodes?.ignoreStatusCodes,
      },
    },
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getPinPostOnWall = async (
  sellerId: Record<string, any>,
  ignoreStatusCodes?: CustomErrorType,
) => {
  return await cancellableRequest(
    'post/getPinPostOnWall',
    `/post/pin/?${stringify(sellerId)}`,
    {
      method: 'GET',
      errorConfig: {
        ignoreStatusCodes: ignoreStatusCodes?.ignoreStatusCodes,
      },
    },
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const togglePostLike = async (id?: string, params?: any) => {
  return await request(`/post/like/${id}?${stringify(params)}`, {
    method: 'GET',
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const GetPosts = async () => {
  return await cancellableRequest('post/allposts', `/post`, {
    method: 'GET',
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const GetMembershipsTiers = async (
  params?: Record<string, any>,
  customError?: Record<string, any>,
  options?: AxiosRequestConfig,
) => {
  return await cancellableRequest(
    '/post/membership',
    `/post/membership?${stringify(params)}`,
    {
      ...options,
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if ((!res || !res?.success) && res?.reason !== 'cancelled') {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const GetMyPosts = async (
  params?: any,
  customError?: { ignoreStatusCodes: number[] },
  options?: AxiosRequestConfig,
  tokenId?: string,
) => {
  const { path = '/post/my-posts?', ...rest } = params;
  return await cancellableRequest(
    `${tokenId || 'post/my-post'}`,
    `${path}${stringify(rest)}`,
    {
      ...options,
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const GetMyScheduledPost = async (
  params?: Record<string, any>,
  customError?: { ignoreStatusCodes: number[] },
) => {
  return await cancellableRequest(
    'post/list-by-range',
    `/post/list-by-range?${stringify(params)}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getPurchaseHistory = async (
  values: any,
  customError?: { ignoreStatusCodes: number[] },
) => {
  return await cancellableRequest(
    'transaction/purchase-history',
    `/wallet-history/${values?.seller}/${values?.buyer}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const GetUserPost = async (
  id?: string,
  params?: Record<string, any>,
  customError?: { ignoreStatusCodes: [number] },
  tokenId?: string,
) => {
  // eslint-disable-next-line
  const prms = params;
  delete prms?.path;
  return await cancellableRequest(
    `${tokenId || 'post/user-post'}`,
    `/post/user/${id}?${stringify(prms)}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createComment = async (id: string, values: any, params?: any) => {
  return await request(`/post/comment/${id}?${stringify(params)}`, {
    method: 'PUT',
    data: values,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const deletePost = async (id: string, params?: Record<string, any>) => {
  return await request(`/post/${id}?${stringify(params)}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const editPost = async (
  id: string,
  data: Record<string, any>,
  params?: Record<string, any>,
) => {
  return await request(`/post/${id}?${stringify(params)}`, {
    method: 'PUT',
    data,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createPost = async (values: any) => {
  return await request('/post', {
    method: 'POST',
    data: values,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const toggleCommentLike = async (id: string, params?: any) => {
  return await request(`/post/comment/like/${id}?${stringify(params)}`, {
    method: 'GET',
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getCommentReplies = async (
  id: string,
  params?: Record<string, any>,
) => {
  return await cancellableRequest(
    'post/getpostcommentReplies',
    `/post/replies/comments/${id}?${stringify(params)}`,
    {
      method: 'GET',
    },
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const addCommentReply = async (id: string, values: any, params: any) => {
  return await request(`/post/reply/comment/${id}?${stringify(params)}`, {
    method: 'PUT',
    data: values,
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getPostComments = async (
  id: string,
  params?: Record<string, any>,
) => {
  return await cancellableRequest(
    'post/getpostcomments',
    `/post/comments/${id}?${stringify(params)}`,
    {
      method: 'GET',
    },
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createPayToViewPaymentIntent = async (subId: string) => {
  return await request(`/post/payment-intent/pay-to-view/${subId}`, {
    method: 'GET',
    errorConfig: {
      ignoreStatusCodes: [404, 500],
    },
  }).then((res: any) => {
    if (res?.data?.client_secret) {
      return res?.data;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createTipPaymentIntent = async (subId: string, values: any) => {
  return await request(`/post/payment-intent/tip/${subId}`, {
    method: 'POST',
    data: values,
    errorConfig: {
      ignoreStatusCodes: [404, 500],
    },
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const payForPost = async (subId: string, dispatch: AppDispatch) => {
  try {
    const secret = await createPayToViewPaymentIntent(subId);
    if (!secret.client_secret) {
      throw new Error(
        secret?.data?.message ||
          'Sorry, Due to some technical issue this action can not be performed',
      );
    }
    await confirmCardPayment(secret, dispatch);

    return request(`/post/payment-confirm/pay-to-view/${subId}`, {
      method: 'GET',
    }).then((res) => {
      if (!res || !res.success) {
        throw new Error(res.data?.message || '');
      }

      return res;
    });
  } catch (error) {
    throw error;
  }
};

export const tipForPost = async (
  subId: string,
  amount: number,
  dispatch: AppDispatch,
) => {
  try {
    const secret = await createTipPaymentIntent(subId, { amount });
    if (!secret.client_secret) {
      throw new Error(
        secret?.data?.message ||
          'Sorry, Due to some technical issue this action can not be performed',
      );
    }

    const res = await confirmCardPayment(secret, dispatch);

    return request(
      `/post/payment-confirm/tip/${subId}/${res?.paymentIntent?.id}`,
      {
        method: 'GET',
      },
    ).then((res) => {
      if (!res || !res.success) {
        throw new Error(res.data?.message || '');
      }

      return res;
    });
  } catch (error) {
    throw error;
  }
};
export const createMemberShipPaymentIntent = async (
  postId: string,
  membershipId: string,
) => {
  return await request(
    `/post/payment-intent/membership/${postId}/${membershipId}`,
    {
      method: 'GET',
    },
  ).then((res: any) => {
    if (res?.data?.client_secret) {
      return res?.data;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const payForMembership = async (
  postId: string,
  membershipId: string,
  dispatch: AppDispatch,
) => {
  try {
    const secret = await createMemberShipPaymentIntent(postId, membershipId);
    if (!secret.client_secret && secret?.post) {
      return secret;
    }
    if (!secret.client_secret) {
      throw new Error(
        secret?.data?.message ||
          'Sorry, Due to some technical issue this action can not be performed',
      );
    }
    const res = await confirmCardPayment(secret, dispatch);
    return request(
      `/post/payment-confirm/membership/${postId}/${res?.paymentIntent?.id}`,
      {
        method: 'GET',
      },
    ).then((res) => {
      if (!res || !res.success) {
        throw new Error(res.data?.message || '');
      }
      return res;
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
export const createMemberShipUpgradePaymentIntent = async (
  subId: string,
  membershipId: string,
) => {
  return await request(
    `/post/membership/payment-intent/${subId}/${membershipId}`,
    {
      method: 'GET',
    },
  ).then((res: any) => {
    if (res?.data?.client_secret) {
      return res?.data;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const payForMembershipUpgrade = async (
  subId: string,
  membershipId: string,
  dispatch: AppDispatch,
) => {
  try {
    const secret = await createMemberShipUpgradePaymentIntent(
      subId,
      membershipId,
    );
    if (secret.success && secret?.message === 'Payment Confirmed') {
      return secret;
    }
    if (!secret.client_secret) {
      throw new Error(
        secret?.data?.message ||
          'Sorry, Due to some technical issue this action can not be performed',
      );
    }
    const res = await confirmCardPayment(secret, dispatch);
    return request(
      `/post/membership/payment-confirm/${subId}/${res?.paymentIntent?.id}`,
      {
        method: 'GET',
      },
    ).then((res) => {
      if (!res || !res.success) {
        throw new Error(res.data?.message || '');
      }
      return res;
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getPostTips = async (
  id: string,
  params: Record<string, any>,
  customError?: Record<string, any>,
) => {
  return await cancellableRequest(
    'post/tips',
    `/post/tips/${id}?${stringify(params)}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getMemberShipsByUserId = async (
  id: string,
  params: Record<string, any>,
  customError?: Record<string, any>,
) => {
  return await cancellableRequest(
    'post/userMemberships',
    `/post/membership/${id}
?${stringify(params)}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getSubscriptionIdByUserId = async (
  id: string,
  params: Record<string, any>,
  customError?: CustomErrorType,
) => {
  return await cancellableRequest(
    'sales/userSubscription',
    `/chat/subscription/${id}
?${stringify(params)}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getSubscriptionById = async (
  id: string,
  params?: Record<string, any>,
  customError?: CustomErrorType,
  options?: IAxiosConfig,
) => {
  return await cancellableRequest(
    'sales/subsDetails',
    `/chat/${id}
?${stringify(params)}`,
    {
      method: 'GET',
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
      ...options,
    },
    null,
    true,
  ).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getPostAnalytics = async (
  postId?: string,
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) => {
  return await request(`/analytics/post/${postId}?${stringify(params)}`, {
    method: 'GET',
    ...options,
  }).then((res: any) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateImagesPhysically = async (data: any) => {
  return await request(`/image/image-update`, {
    method: 'PUT',
    data: { ...data, from: 'post' },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getYouMayknowUsers = async (
  customError?: CustomErrorType,
  options?: AxiosRequestConfig,
) => {
  return await request(`/user/include-in-discovery`, {
    method: 'GET',
    ...options,
    errorConfig: customError,
  }).then((res: any) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
