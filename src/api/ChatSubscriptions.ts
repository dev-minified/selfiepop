import { AxiosRequestConfig } from 'axios';
import { stringify } from 'querystring';
import { AppDispatch } from 'store/store';
import request, { cancellableRequest } from 'util/request';
import { confirmCardPayment } from './app';

export const sendChatMessage = async (
  subscriptionId: string,
  data: Record<string, any>,
) => {
  const res = await request(`/chat/message/${subscriptionId}`, {
    method: 'POST',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const getMessages = async (
  subscriptionId: string,
  options?: AxiosRequestConfig,
  handleError: boolean = true,
) => {
  const res = await request(
    `/chat/legacy/list/${subscriptionId}`,
    {
      ...options,
      method: 'GET',
    },
    null,
    true,
    handleError,
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
const confirmSubRenewel = async (intentId: string, subId: string) => {
  const res = await request(
    `/chat/subscription/confirm/renew/${intentId}/${subId}`,
    {
      method: 'GET',
    },
  );
  if (!res || !res.success) {
    // dispatch(onCardModalOpen());
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const chatUnsubscribe = async (
  subscriptionId: string,
  data: Record<string, any>,
  // {autoRenew: boolean}
) => {
  let res = await request(`/chat/subscription/renew/${subscriptionId}`, {
    method: 'GET',
    data,
  });
  if (!!res?.client_secret) {
    await confirmCardPayment({ client_secret: res?.client_secret });
    if (!!res?.transactionId) {
      res = await confirmSubRenewel(res?.transactionId, subscriptionId);
    } else {
      throw new Error('Subscription Renewal Fail!');
    }
  } else {
    throw new Error('Subscription Renewal Failed!');
  }
  if (!res || !res.success) {
    // dispatch(onCardModalOpen());
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const cancelAutoReniew = async (subscriptionId: string) => {
  // const res = await request(`/chat/renew/subscription/${subscriptionId}`, {
  //   method: 'POST',
  //   data,
  // });
  const res = await request(`/chat/subscription/cancel/${subscriptionId}`, {
    method: 'DELETE',
  });
  if (!res || !res.success) {
    // dispatch(onCardModalOpen());
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const addPriceVariation = async (
  popId: string,
  data: Record<string, any>, // {autoRenew: boolean}
) => {
  const res = await request(`/pop/push/${popId}`, {
    method: 'PUT',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const delPriceVariation = async (
  popId: string,
  data: Record<string, any>, // {autoRenew: boolean}
) => {
  const res = await request(`/pop/pull/${popId}`, {
    method: 'PUT',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const updateVariation = async (
  popId: string,
  data: Record<string, any>, // {autoRenew: boolean}
  query?: Record<string, any>,
) => {
  const res = await request(`/pop/update/${popId}?${stringify(query)}`, {
    method: 'PUT',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const getSubscriptionByNotes = async (
  subscriptionId?: string,
  params?: any,
  options?: AxiosRequestConfig,
) => {
  const res = await request(
    `/chat/notes/${subscriptionId}?${stringify(params)}`,
    {
      method: 'get',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const addNote = async (
  subscriptionId: string,
  data: Record<string, any>,
) => {
  const res = await request(`/chat/note/${subscriptionId}`, {
    method: 'PUT',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const deleteNote = async (
  subscriptionId: string,
  noteId: string,
  params?: Record<string, any>,
) => {
  const res = await request(
    `/chat/note/${subscriptionId}/${noteId}?${stringify(params)}`,
    {
      method: 'DELETE',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const deleteChat = async ({
  subscriptionId,
  messageId,
  params = {},
}: {
  subscriptionId: string;
  messageId?: string;
  params?: Record<string, any>;
}) => {
  const res = await request(
    `/chat/${subscriptionId}/${messageId}?${stringify(params)}`,
    {
      method: 'DELETE',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const addTag = async (
  subscriptionId: string,
  data: Record<string, any>,
) => {
  const res = await request(`/chat/add/tag/${subscriptionId}`, {
    method: 'PUT',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const deleteTag = async (
  subscriptionId: string,
  data: Record<string, any>,
) => {
  const res = await request(`/chat/remove/tag/${subscriptionId}`, {
    method: 'DELETE',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const addEmoji = async (
  subscriptionId: string,
  messageId: string,
  data: { type: string },
) => {
  const res = await request(`/chat/emoji/${subscriptionId}/${messageId}`, {
    method: 'PUT',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const getSubscriptionsList = async (params = {}) => {
  const res = await request(`/chat/subscription/list?${stringify(params)}`, {
    method: 'GET',
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const getAllMedia = async (id: string, options: AxiosRequestConfig) => {
  const res = await request(`/chat/media/library/${id}`, {
    ...options,
    method: 'GET',
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const addNickNameAndNotifications = async (
  subscriptionId: string,
  data: Record<string, any>,
  query?: Record<string, any>,
) => {
  const res = await request(
    `/chat/update/${subscriptionId}?${stringify(query)}`,
    {
      method: 'PUT',
      data,
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const sendMedia = async (
  subscriptionId: string,
  data: {
    library: {
      type?: string;
      thumbnail?: string;
      path?: string;
      isPaidType?: boolean;
      videoDuration?: string;
      name?: string;
    }[];
    message?: string;
    price?: number;
  },
) => {
  const res = await request(`/chat/media/${subscriptionId}`, {
    method: 'POST',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

const createPaidMessagePaymentIntent = async (
  subId: string,
  messageId: string,
) => {
  return await request(
    `/chat/payment/message/intent/${subId}/${messageId}`,
  ).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};

export const payForMessage = async (
  subId: string,
  messageId: string,
  dispatch: AppDispatch,
) => {
  const secret = await createPaidMessagePaymentIntent(subId, messageId);
  if (!secret.client_secret) {
    throw new Error(
      secret?.data?.message ||
        'Sorry, Due to some technical issue this action can not be performed',
    );
  }

  await confirmCardPayment(secret, dispatch);

  return request(`/chat/buy/message/${subId}/${messageId}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};
export const getSubScriptionsSubList = async (query?: Record<string, any>) => {
  const res = await request(`/chat/fav/subscription/list?${stringify(query)}`, {
    method: 'GET',
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const createSubsList = async (
  subscriptionId: string,
  data: Record<string, any>,
) => {
  const res = await request(`/chat/subscription/list/${subscriptionId}`, {
    method: 'POST',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const addUserInSubsList = async (
  subscriptionId: string,
  listId: string,
  params = {},
) => {
  const res = await request(
    `/chat/subscription/list/${subscriptionId}/${listId}?${stringify(params)}`,
    {
      method: 'PUT',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const deleteUserInSubsList = async (
  subscriptionId: string,
  listId: string,
  params = {},
) => {
  const res = await request(
    `/chat/subscription/list/${subscriptionId}/${listId}?${stringify(params)}`,
    {
      method: 'DELETE',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const createGiftBillingIntend = async (
  subId: string,
  data: Record<string, any>,
) => {
  return await request(`/chat/gift/intent/${subId}`, {
    method: 'POST',
    data,
  });
};

export const sendCheckoutGiftId = async (giftId: string) => {
  return await request(`/chat/gift/order/${giftId}`, {
    method: 'POST',
  });
};

export const createCheckoutBillingIntent = async (subId: string) => {
  return await request(`/chat/gift/intent/${subId}`, {
    method: 'GET',
  });
};
export const confirmGiftSub = async (id: string, handleError = true) => {
  const res = await request(
    `/chat/gift/subscription/confirmation/${id}
`,
    {
      method: 'GET',
    },
    null,
    true,
    handleError,
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const getGiftById = async (id: string, handleError = true) => {
  const res = await request(
    `/chat/gift/${id}
`,
    {
      method: 'GET',
    },
    null,
    true,
    false,
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const getLogHistory = async (
  subscriptionId: string,
  params?: Record<string, any>,
) => {
  return request(`/rules/log/${subscriptionId}?${stringify(params)}`, {
    method: 'GET',
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updatesubForTextMessagesNotifications = async (
  subScriptionId: string,
  textNotification: boolean,
) => {
  return request(`/chat/notification/${subScriptionId}`, {
    method: 'PUT',
    data: { textNotification },
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getExpiredorNearExpiredList = async (
  params?: Record<string, any>,
  options: { errorConfig?: CustomErrorType } & Partial<AxiosRequestConfig> = {},
) => {
  return cancellableRequest(
    'expiredSubs',
    `/chat/expired/list?${stringify(params)}`,
    {
      method: 'GET',
      ...options,
    },
  ).then((res) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const renewAllpendigSubs = async (
  qs?: Record<string, any>,
  options: { errorConfig?: CustomErrorType } & Partial<AxiosRequestConfig> = {},
) => {
  return cancellableRequest(
    'renewAllpendingsubs',
    `/chat/subscription/all/renew?${stringify(qs)}`,
    {
      method: 'POST',
      ...options,
    },
  ).then((res) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
