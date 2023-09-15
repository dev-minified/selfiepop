import request from '../util/request';

export const getManagedAccounts = async () => {
  return request('/managed-accounts/list').then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const managedAccountsAccepted = async (id: string) => {
  return request(`/managed-accounts/${id}/accept`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
