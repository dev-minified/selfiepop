import { stringify } from 'querystring';
import request from 'util/request';

export const getListKnowledge = async (query?: Record<string, any>) => {
  return request(`/knowledge?${stringify(query)}`).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
