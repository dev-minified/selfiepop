import request, { cancellableRequest } from '../util/request';

export const create = async (values: any) => {
  return await request('/pop', {
    method: 'POST',
    data: values,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createPop = async (values: any) => {
  return await cancellableRequest('createPop', `/pop`, {
    method: 'POST',
    data: values,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updatePopData = async (values: any, popId: string) => {
  return await cancellableRequest('updatepop', `/pop/${popId}`, {
    method: 'PUT',
    data: values,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res.data;
  });
};

export const addPriceVariation = async (values: any, popID: string) => {
  return await request(`/pop/push/${popID}`, {
    method: 'PUT',
    data: { name: 'priceVariations', value: values },
  });
};
export const updatePop = async (values: any, popId: string) => {
  return await request(`/pop/${popId}`, { method: 'PUT', data: values }).then(
    (res) => {
      if (!res || !res?.success) {
        throw new Error(res?.data?.message || '');
      }
      return res.data;
    },
  );
};

export const getPopByName = async (
  userName: string,
  popSlug: string,
  errorConfig?: CustomErrorType,
) => {
  return request(`/pop/get-by-pop-name/${userName}/${popSlug}`, {
    errorConfig: { ignoreStatusCodes: errorConfig?.ignoreStatusCodes || [] },
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getPopLiveAvailability = async (popId: string) => {
  return request(`/pop/get-pop-live-availability/${popId}`).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const sortPopArribute = async ({
  popId = '',
  values = [],
  attributeName = '',
}: {
  popId: string;
  values: any;
  attributeName: string;
}) => {
  const res = await request(`/pop/sort/${popId}`, {
    method: 'PUT',
    data: { list: values, name: attributeName },
  });
  if (!res || !res.success) {
    throw new Error(res.data?.message || '');
  }
  return res;
};
