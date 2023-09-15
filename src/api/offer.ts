import { AppDispatch } from 'store/store';
import request from 'util/request';
import { confirmCardPayment } from './app';

export const createOfferIntent = async (orderId: string, offerId: string) => {
  return request(`/order/conversation/create-offer-intent`, {
    method: 'POST',
    data: {
      orderId,
      offerId,
    },
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res.data?.message || '');
    }

    return res;
  });
};

export const createOffer = async (orderId: string, offer: Offer) => {
  const res = await request(`/order/conversation/${orderId}/offers`, {
    method: 'POST',
    data: offer,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const acceptOffer = async (
  orderId: string,
  offerId: string,
  dispatch: AppDispatch,
) => {
  const secret = await createOfferIntent(orderId, offerId);
  if (!secret.client_secret) {
    throw new Error(
      secret?.data?.message ||
        'Sorry, Due to some technical issue this action can not be performed',
    );
  }

  await confirmCardPayment(secret, dispatch);

  const res = await request(
    `/order/conversation/${orderId}/offer/${offerId}/accept`,
    {
      method: 'GET',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const declineOffer = async (orderId: string, offerId: string) => {
  const res = await request(
    `/order/conversation/${orderId}/offer/${offerId}/decline`,
    {
      method: 'GET',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const withdrawOffer = async (orderId: string, offerId: string) => {
  const res = await request(
    `/order/conversation/${orderId}/offer/${offerId}/withdraw`,
    {
      method: 'GET',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
