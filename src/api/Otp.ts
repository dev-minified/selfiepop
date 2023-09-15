import request from '../util/request';

export const getUpdatedVerifyEmailAddress = async () => {
  return request(`/user/verify-email-address`, {
    method: 'GET',
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const requestChangeEmailAddress = async (values: any) => {
  return request(`/user/change-email-address`, {
    method: 'POST',
    data: values,
  }).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};

export const VerifyEmailAddressupdate = async (
  values: any,
  customError?: Record<string, any>,
) => {
  return request(
    `/user/verify-email-address`,
    {
      method: 'POST',
      data: values,
      errorConfig: { ignoreStatusCodes: customError?.ignoreStatusCodes },
    },
    null,
    true,
    true,
    '',
  ).then((res: any) => {
    if (!res.success) {
      throw new Error(res.data.message);
    }
    return res;
  });
};
