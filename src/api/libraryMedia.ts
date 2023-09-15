import { AxiosRequestConfig } from 'axios';
import request, { cancellableRequest } from '../util/request';

export const createLibraryFolter = async ({
  name,
  errorConfig,
  options,
}: {
  name: string;
  errorConfig?: CustomErrorType;
  options?: AxiosRequestConfig;
}) => {
  return request('/media/folder', {
    data: { name },
    method: 'POST',
    ...(options || {}),
    errorConfig: errorConfig,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getlibraryFolterList = async (
  options?: AxiosRequestConfig,
  errorConfig?: CustomErrorType,
) => {
  return request('/media/folder/list', {
    method: 'GET',
    ...options,
    errorConfig,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateLibraryFolter = async ({
  id,
  name,
  errorConfig,
  options,
}: {
  id: string;
  name: string;
  errorConfig?: CustomErrorType;
  options?: AxiosRequestConfig;
}) => {
  return request(`/media/folder/${id}`, {
    data: { name },
    method: 'PUT',
    ...(options || {}),
    errorConfig,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getMediaLibrary = async ({
  id,
  errorConfig,
}: {
  id: string;
  errorConfig?: CustomErrorType;
}) => {
  return cancellableRequest('getMediaLibrary', `/media/library/${id}`, {
    errorConfig,
    method: 'GET',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getMediaFolder = async ({
  id,
  errorConfig,
}: {
  id: string;
  errorConfig?: CustomErrorType;
}) => {
  return cancellableRequest('getMediaFolder', `/media/folder/${id}`, {
    errorConfig,
    method: 'GET',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createMedia = async ({
  folderId,
  files,
  errorConfig,
  options,
}: {
  folderId: string;
  files: MediaType[];
  errorConfig?: CustomErrorType;
  options?: AxiosRequestConfig;
}) => {
  return request(`/media/library`, {
    data: {
      files: files,
      folderId,
    },
    method: 'POST',
    ...(options || {}),
    errorConfig,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getFolderMedia = async ({
  id,
  params,
  errorConfig,
}: {
  id: string;
  params?: Record<string, any>;
  errorConfig?: CustomErrorType;
}) => {
  return cancellableRequest('getFolderMedia', `/media/library/list/${id}`, {
    errorConfig,
    method: 'GET',
    params: params,
  }).then((res) => {
    if (res?.cancelled) {
      return res;
    }
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateFolderMedia = async ({
  id,
  data,
  options,
  errorConfig,
}: {
  id: string;
  data: Record<string, any>;
  options?: AxiosRequestConfig;
  errorConfig?: CustomErrorType;
}) => {
  return request(`/media/library/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
    errorConfig,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const moveLibraryMedia = async ({
  data,
  errorConfig,
  options,
}: {
  data: {
    ids: string[];
    folderId: string;
  };
  errorConfig?: CustomErrorType;
  options?: AxiosRequestConfig;
}) => {
  return request(`/media/library/move`, {
    data: data,
    method: 'PUT',
    ...(options || {}),
    errorConfig,
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const deleteMediaWithFolder = async ({
  folderId,
  errorConfig,
  options,
}: {
  folderId: string;
  errorConfig?: CustomErrorType;
  options?: AxiosRequestConfig;
}) => {
  return cancellableRequest('deleteWithFolder', `/media/folder/${folderId}`, {
    ...(options || {}),
    errorConfig,
    method: 'DELETE',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const deleteMediainLibrary = async ({
  mediaId,
  errorConfig,
  options,
}: {
  mediaId: string;
  errorConfig?: CustomErrorType;
  options?: AxiosRequestConfig;
}) => {
  return cancellableRequest(
    'deleteMediainLibrary',
    `/media/library/${mediaId}`,
    {
      ...(options || {}),
      errorConfig,
      method: 'DELETE',
    },
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const deleteMediainTrashLibrary = async ({
  mediaId,
  errorConfig,
  options,
}: {
  mediaId: string;
  errorConfig?: CustomErrorType;
  options?: AxiosRequestConfig;
}) => {
  return cancellableRequest(
    'deleteMediainTrashLibrary',
    `/media/library/trash/${mediaId}`,
    {
      ...(options || {}),
      errorConfig,
      method: 'DELETE',
    },
  ).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
