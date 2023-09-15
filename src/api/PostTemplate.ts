import { stringify } from 'querystring';
import request from 'util/request';

export const getPostTemplates = async (params?: any, options?: any) => {
  const res = await request(`/post/template-post?${stringify(params)}`, {
    ...options,
    method: 'GET',
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
export const getScheduleTemplates = async (params?: any, options?: any) => {
  const res = await request(
    `/scheduled-message/list-template?${stringify(params)}`,
    {
      ...options,
      method: 'GET',
    },
  );
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};

export const getChatTemplates = async (params?: any, options?: any) => {
  const res = await request(`/chat/template-chat?${stringify(params)}`, {
    ...options,
    method: 'GET',
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
