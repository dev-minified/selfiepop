import request from '../util/request';

export const getUserByHash = async (id: any, cookies: any = null) => {
  return request(`/user/invitation/${id}`, {}, cookies);
};

export const acceptInvitation = async (data: any, cookies: any = null) => {
  return request(
    '/user/accept/invitation',
    {
      data,
      method: 'POST',
    },
    cookies,
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
