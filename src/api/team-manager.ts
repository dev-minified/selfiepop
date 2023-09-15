import request from '../util/request';

export const getTeamManagedUsersList = async () => {
  return request('/managers/list').then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const deleteTeamManagedUsers = async (
  id: string,
  params?: Record<string, any>,
) => {
  return request(`/managers/${id}/cancel`, {
    method: 'DELETE',
    data: params,
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getMemberManagerAccountById = async (
  id: string,
  params?: Record<string, any>,
) => {
  return request(`/user/get-manager/${id}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const findManagedUsers = async (userName: any) => {
  return request(`/user/search/${userName}`).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const teamMemberInvite = async (data: Record<string, any>) => {
  const res = await request('/managers/invite', {
    method: 'POST',
    data,
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
