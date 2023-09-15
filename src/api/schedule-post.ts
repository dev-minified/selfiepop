import { stringify } from 'querystring';
import request from 'util/request';

export const publishNow = async (
  postId: string,
  params?: Record<string, any>,
) => {
  return request(`/post/publish/${postId}?${stringify(params)}`, {
    method: 'GET',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
