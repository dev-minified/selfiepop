import qs, { stringify } from 'querystring';
import request, { cancellableRequest } from 'util/request';

export const getMessages = async (query: {
  date?: string;
  startDate?: string;
  endDate?: string;
  sellerId?: string;
}) => {
  return cancellableRequest(
    'scheduled-messages',
    `/scheduled-message/list-by-range?${qs.stringify(query)}`,
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const addMessage = async (
  data: Pick<
    ChatMessage,
    | 'publishDateTime'
    | 'messageValue'
    | 'messageMedia'
    | 'price'
    | 'blurThumnail'
    | 'templateId'
  > & { sellerId?: string },
) => {
  return request(`/scheduled-message`, {
    method: 'POST',
    data: data,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const deleteMessage = async (
  messageId: string,
  params?: Record<string, any>,
) => {
  return request(`/scheduled-message/${messageId}?${stringify(params)}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateMessage = async (
  messageId: string,
  data: Partial<ChatMessage>,
) => {
  return request(`/scheduled-message/${messageId}`, {
    method: 'PUT',
    data,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getMediaList = async (sellerId?: string) => {
  return request(`/scheduled-message/media-library?sellerId=${sellerId}`, {
    method: 'GET',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const publishNow = async (
  messageId: string,
  params?: Record<string, any>,
) => {
  return request(
    `/scheduled-message/publish/${messageId}?${stringify(params)}`,
    {
      method: 'GET',
    },
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
