import request from '../util/request';

export const getSocialAccounts = async () => {
  return request('/social-media/links').then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const createSocialAccount = async (data: {
  name: string;
  url: string;
  type: string;
}) => {
  return request('/social-media/links', { method: 'POST', data }).then(
    (res) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const updateSocialAccount = async (
  id: string,
  data: { name: string; url: string; type: string },
) => {
  return request(`/social-media/links/${id}`, { method: 'PUT', data }).then(
    (res) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const deleteSocialAccount = async (id: string) => {
  return request(`/social-media/links/${id}`, { method: 'DELETE' }).then(
    (res) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const getSocialAccount = async (id: string) => {
  return request(`/social-media/links/${id}`, { method: 'GET' }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
