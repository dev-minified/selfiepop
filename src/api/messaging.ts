import request from 'util/request';

export const sendOrderMessage = async (orderId: string, message: Message) => {
  const res = await request(`/order/conversation/${orderId}/messages`, {
    method: 'POST',
    data: message,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const getOrderMessages = async (orderId: string) => {
  const res = await request(`/order/conversation/${orderId}/messages`, {
    method: 'GET',
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
