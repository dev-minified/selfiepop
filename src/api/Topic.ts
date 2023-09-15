import request from 'util/request';

export const getTopicById = async (id: string) => {
  return request(`/topic/${id}`).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
