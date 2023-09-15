import { AxiosRequestConfig } from 'axios';
import request from '../util/request';

export const sendInvite = async (values: {
  name: string;
  phone: string;
  eParam: string;
}) => {
  return request(`/event/invite`, {
    method: 'POST',
    data: values,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res;
  });
};
export const getInviteBytID = async (
  id: string,
  options?: AxiosRequestConfig,
  errorConfig?: CustomErrorType,
) => {
  return request(`/event/invite/${id}`, {
    method: 'GET',
    ...options,
    errorConfig,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res.data;
  });
};
export const getAttendeeBytID = async (
  phone: string,
  errorConfig?: CustomErrorType,
) => {
  return request(`/event-attendee/${phone}`, {
    method: 'GET',

    errorConfig,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res.data;
  });
};

export const sendPromo = async (values: {
  name: string;
  phone: string;
  eParam: string;
}) => {
  return request(`/street-promo`, {
    method: 'POST',
    data: values,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res;
  });
};
export const getStreetPromoSession = async (
  id: string,
  options?: CustomErrorType,
) => {
  return request(`/street-promo/${id}`, {
    method: 'GET',
    errorConfig: options,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res;
  });
};
export const removeStreetPromoSession = async (id: string) => {
  return request(`/street-promo/${id}`, {
    method: 'DELETE',
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data?.message);
    }
    return res;
  });
};
