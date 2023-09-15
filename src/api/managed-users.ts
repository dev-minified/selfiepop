import { stringify } from 'querystring';
import request from '../util/request';

export const getManagedUsers = async () => {
  return request('/user/manager/list').then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getManagedAccountById = async (
  id: string,
  params?: Record<string, any>,
) => {
  return request(`/user/managed/${id}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const acceptManagedRequest = (accountId: string) => {
  return request(`/managed-accounts/${accountId}/accept`, {
    method: 'POST',
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const declineManagedRequest = (
  accountId: string,
  params: { reason: string },
) => {
  return request(
    `/managed-accounts/${accountId}/decline?${stringify(params)}`,
    {
      method: 'DELETE',
    },
  ).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getManagedUserDetails = async (userId: string) => {
  return request(`/user/manager/${userId}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
