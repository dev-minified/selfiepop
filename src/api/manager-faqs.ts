import request from '../util/request';

export const getManagerFaqsList = async (sellerId: string) => {
  return request(`/manager-faqs/list/${sellerId}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getManagerFaq = async (faqId: string) => {
  return request(`/manager-faqs/${faqId}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const createManagerFaq = async (data: ManagerFAQ) => {
  return request(`/manager-faqs`, { method: 'POST', data }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateManagerFaq = async (
  faqId: string,
  data: Partial<ManagerFAQ>,
) => {
  return request(`/manager-faqs/${faqId}`, { method: 'PUT', data }).then(
    (res) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const deleteManagerFaq = async (faqId: string) => {
  return request(`/manager-faqs/${faqId}`, { method: 'DELETE' }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
