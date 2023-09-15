import { stringify } from 'querystring';
import { cancellableRequest } from '../util/request';

export const getUnlockMedia = async (
  sellerId: string = '',
  type: string = '',
  params?: Record<string, any>,
) => {
  const param = { ...params, type };
  return await cancellableRequest(
    'UnlockMedia',
    `/order/unlock/media/${sellerId}?${stringify(param)}`,
  ).then((res) => {
    if (res.cancelled) {
      return res;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
