import request from '../util/request';

export const getRules = async (sellerId: string = '') => {
  return request(`/rules?sellerId=${sellerId}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const createRule = async (
  data: Partial<RuleMetadata>,
  sellerId: string = '',
) => {
  return request(`/rules?sellerId=${sellerId}`, { method: 'POST', data }).then(
    (res) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const updateRule = async (
  id: string,
  data: Partial<RuleMetadata>,
  sellerId: string = '',
) => {
  return request(`/rules/${id}?sellerId=${sellerId}`, {
    method: 'PUT',
    data,
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const deleteRule = async (id: string, sellerId: string = '') => {
  return request(`/rules/${id}?sellerId=${sellerId}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getRule = async (id: string, sellerId: string = '') => {
  return request(`/rules/${id}?sellerId=${sellerId}`, { method: 'GET' }).then(
    (res) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};
