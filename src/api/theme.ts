import qs from 'querystring';
import request from '../util/request';

export const createTheme = async (data: { baseURL: string } & ITheme) => {
  if ((data.categoryId as any)?._id) {
    data.categoryId = (data.categoryId as any)?._id;
  }
  return request('/user-theme', {
    data,
    method: 'POST',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateTheme = async (
  id: string,
  data: { baseURL: string } & ITheme,
) => {
  if ((data.categoryId as any)?._id) {
    data.categoryId = (data.categoryId as any)?._id;
  }
  return request(`/user-theme/${id}`, {
    data,
    method: 'POST',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const deleteTheme = async (id: string) => {
  return request(`/user-theme/${id}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getAllThemes = async (query?: { isDefault?: true }) => {
  return request(`/user-theme?${qs.stringify(query)}`).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getTheme = async (themeId: string) => {
  return request(`/user-theme/${themeId}`).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const removeLibraryImage = async (imageId: string) => {
  return request(`/image/library/${imageId}`, { method: 'DELETE' }).then(
    (res) => {
      if (!res || !res?.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const getLibrary = async () => {
  return request('/image/library', { method: 'GET' }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getThemeCategories = async () => {
  return request('/user-theme/category', { method: 'GET' }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const createThemeCategory = async (name: string) => {
  return request('/user-theme/category', {
    data: { name },
    method: 'POST',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateThemeCategory = async (data: any) => {
  return request(`/user-theme/category/${data.id}`, {
    data,
    method: 'POST',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateThemeSorting = async (data: {
  ids: string[];
  type?: string;
}) => {
  return request(`/user-theme/sort`, {
    data,
    method: 'POST',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const updateCategorySorting = async (data: {
  ids: string[];
  type?: string;
}) => {
  return request(`/user-theme/category/sort`, {
    data,
    method: 'POST',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getThemeByCategory = async (
  categoryId: string,
  query?: Record<string, any>,
) => {
  return request(`/user-theme/category/${categoryId}?${qs.stringify(query)}`, {
    method: 'GET',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getThemeByIds = async (ids: string[]) => {
  return request(`/user-theme?id=${ids.join(',')}`, {
    method: 'GET',
  }).then((res) => {
    if (!res || !res?.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
