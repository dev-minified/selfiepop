import { AppDispatch } from 'store/store';
import { AppAlert } from '../components/Model';
import { getLocalStorage } from '../util';
import request from '../util/request';
import { confirmCardPayment } from './app';

export const fetchCards = async (errorConfig?: CustomErrorType) => {
  const headers: any = {};
  const gu: any = getLocalStorage('guestTokens');
  if (gu?.token) {
    headers['Authorization'] = `Bearer ${gu.token}`;
  }
  return await request('/billing', { headers, errorConfig });
};

export const createBillingIntend = async (orderId: string) => {
  const headers: any = {};
  const gu: any = getLocalStorage('guestTokens');
  if (gu?.token) {
    headers['Authorization'] = `Bearer ${gu.token}`;
  }

  return await request('/billing/create-payment-intent', {
    headers,
    method: 'POST',
    data: {
      orderId,
    },
  });
};

export const chargeUser = async (
  { orderId, cardId, isCreatingIntent = true, checkCards = true }: any,
  cookies: any = null,
  dispatch?: AppDispatch,
) => {
  const headers: any = {};
  const gu: any = getLocalStorage('guestTokens');
  if (gu?.token) {
    headers['Authorization'] = `Bearer ${gu.token}`;
  }

  try {
    let card: any = { id: cardId };
    if (!cardId && checkCards) {
      const cards = await fetchCards();
      card = cards.sources.find((item: any) => item.isPrimary);
      if (!card.id) throw new Error('Problem adding card');
    }

    if (isCreatingIntent) {
      const clientSceret = await createBillingIntend(orderId);

      if (!clientSceret.client_secret) {
        throw new Error(
          clientSceret?.data?.message ||
            'Sorry, Due to some technical issue this action can not be performed',
        );
      }

      await confirmCardPayment(clientSceret, dispatch, async () => {
        await deleteBillingIntend(
          {
            cardId: cardId,
            orderId: orderId,
          },
          orderId,
        );
      });
    }

    const response = await request('/billing/charge-customer', {
      headers,
      method: 'POST',
      data: {
        orderId,
        cardId: card.id,
      },
    });

    if (response?.error) {
      throw new Error(response.message);
    }
    return response;
  } catch (error: any) {
    let title = 'Oops! We ran into some problems';
    if (error.message === 'You have already purchased') {
      title = 'Duplicate Pop Purchased Error';
      error.message = error.message + ' this pop.';
    }
    AppAlert({
      title: title,
      text: error.message,
    });
    throw error;
  }
};
export const addStripeCustomer = async (billingMethodData: any) => {
  const headers: any = {};
  const gu: any = getLocalStorage('guestTokens');
  console.log({ gu });
  if (gu?.token) {
    headers['Authorization'] = `Bearer ${gu.token}`;
  }

  return await request('/billing/customer', {
    headers,
    method: 'POST',
    data: billingMethodData,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const deleteBillingIntend: any = async (
  billingMethodData: any,
  orderId: string,
) => {
  return await request(`/billing/payment-intent/${orderId}`, {
    method: 'DELETE',
    data: billingMethodData,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const updateStripeCustomer = async (billingMethodData: any) => {
  return await request('/billing/card', {
    method: 'PUT',
    data: billingMethodData,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const updatePrimarySource = async (cardId: string) => {
  return request(`/billing/change-primary-source/${cardId}`, {
    method: 'POST',
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const removeCard = async (cardId: string) => {
  return request(`/billing/${cardId}`, {
    method: 'DELETE',
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const getStripeConnectLink = async (
  email: string,
  ignoreStatusCodes?: CustomErrorType,
) => {
  return request(`/stripeConnect/get-stripe-connect-link/${email}`, {
    errorConfig: {
      ignoreStatusCodes: ignoreStatusCodes?.ignoreStatusCodes,
    },
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const getDashboardLink = async (ignoreStatusCodes?: CustomErrorType) => {
  return request('/stripeConnect/get-dashboard-link', {
    errorConfig: {
      ignoreStatusCodes: ignoreStatusCodes?.ignoreStatusCodes,
    },
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const getStripeId = async (code: string) => {
  return request(`/stripeConnect/get-stripe-id/?code=${code}`).then(
    (res: any) => {
      if (!res.success) {
        throw new Error(res.data.message);
      }
      return res;
    },
  );
};

export const getWalletHistory = async (params?: {
  skip?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return request('/wallet-history', { params }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const createTransfer = async (data: any) => {
  return request('/stripeConnect/create-transfer', {
    data,
    method: 'POST',
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};
