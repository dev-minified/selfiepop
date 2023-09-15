import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  createLibraryFolter,
  createMedia,
  deleteMediainLibrary,
  deleteMediainTrashLibrary,
  deleteMediaWithFolder,
  getFolderMedia,
  getlibraryFolterList,
  getMediaFolder,
  getMediaLibrary,
  moveLibraryMedia,
  updateFolderMedia,
  updateLibraryFolter,
} from 'api/libraryMedia';
import { AxiosRequestConfig } from 'axios';
import { RootState } from 'store/store';

export interface IMedialibraryFilesType {
  libraryMedia?: MediaType[];
  libraryList?: { totalCount: number; items: MediaFolder[] };
  inProgressGellaryId?: Record<string, any>;
  activeFolder?: MediaFolder;
  activeLibrary?: { totalCount: number; items: MediaLibrary[] };
  selectedMediaItems?: Record<string, MediaLibrary>;
  libraryLoading?: boolean;
  itemsDragging?: boolean;
  alreadySharedMediaIds?: Record<string, string>;
  existingSharedMediasSelected?: Record<string, string>;
}
// Define the initial state using that type
const initialState: IMedialibraryFilesType = {
  libraryMedia: [],
  libraryList: { totalCount: 0, items: [] },
  inProgressGellaryId: {},
  activeFolder: undefined,
  selectedMediaItems: {},
  alreadySharedMediaIds: {},
  existingSharedMediasSelected: {},
  libraryLoading: false,
  itemsDragging: false,
};

export const getLibraryFolder = createAsyncThunk<
  any,
  {
    options?: AxiosRequestConfig;
    customErrorType?: CustomErrorType;
    callback?: (...args: any) => void;
  }
>(`/getLibraryFolders`, async ({ options, customErrorType, callback }) => {
  const res = await getlibraryFolterList(options, customErrorType);
  callback?.(res);
  return res;
});
export const updateFolderMediaItem = createAsyncThunk<
  any,
  {
    id: string;
    data: Record<string, any>;
    index?: number;
    options?: AxiosRequestConfig;
    customErrorType?: CustomErrorType;
    callback?: (...args: any) => void;
  }
>(
  `/updateFolderMediaItem`,
  async ({ id, data, options, index, customErrorType, callback }) => {
    const res = await updateFolderMedia({
      id,
      data,
      options,
      errorConfig: customErrorType,
    });
    callback?.(res);
    return { ...res, id, index };
  },
);
export const updateLibraryFolderName = createAsyncThunk<
  MediaFolder,
  {
    id: string;
    name: string;
    params?: CustomErrorType;
    options?: AxiosRequestConfig;
    onCallback?: (...args: any) => void;
  }
>(`/updateFolderName`, async ({ id, name, params, onCallback, options }) => {
  const res = await updateLibraryFolter({
    id,
    name,
    errorConfig: params,
    options,
  });
  onCallback?.(res);
  return res;
});
export const deleteFolderWithMedia = createAsyncThunk<
  any,
  {
    folderId: string;

    params?: CustomErrorType;
    options?: AxiosRequestConfig;
    onCallback?: (...args: any) => void;
  }
>(
  `/deleteFolderWithMedia`,
  async ({ folderId, params, options, onCallback }) => {
    const res = await deleteMediaWithFolder({
      folderId,
      errorConfig: params,
      options,
    });
    onCallback?.(res);
    return res;
  },
);
export const deleteMediaInLibrary = createAsyncThunk<
  any,
  {
    mediaId: string;
    index?: number;
    folderId?: string;
    errorConfig?: CustomErrorType;
    options?: AxiosRequestConfig;
    onCallback?: (...args: any) => void;
  }
>(
  `/deleteMediaInLibrary`,
  async ({ mediaId, index, folderId, errorConfig, options, onCallback }) => {
    const res = await deleteMediainLibrary({
      mediaId,
      errorConfig,
      options,
    });
    onCallback?.(res);
    return { ...res, index, mediaId, folderId };
  },
);
export const deleteMediaInTrashLibrary = createAsyncThunk<
  any,
  {
    mediaId: string;
    index?: number;
    folderId?: string;
    errorConfig?: CustomErrorType;
    options?: AxiosRequestConfig;
    onCallback?: (...args: any) => void;
  }
>(
  `/deleteMediaInTrashLibrary`,
  async ({ mediaId, index, folderId, errorConfig, options, onCallback }) => {
    const res = await deleteMediainTrashLibrary({
      mediaId,
      errorConfig,
      options,
    });
    onCallback?.(res);
    return { ...res, index, mediaId, folderId };
  },
);
export const createLibraryFolderName = createAsyncThunk<
  MediaFolder,
  {
    name: string;
    params?: CustomErrorType;
    onCallback?: (...args: any) => void;
    options?: AxiosRequestConfig;
  }
>(`/createFolderName`, async ({ name, params, options, onCallback }) => {
  const res = await createLibraryFolter({ name, errorConfig: params, options });
  onCallback?.(res);
  return res;
});
export const getSingleLibrary = createAsyncThunk<
  any,
  {
    id: string;
    params?: CustomErrorType;
    onCallback?: (...args: any) => void;
  }
>(`/getMediaLibrary`, async ({ id, params, onCallback }) => {
  const res = await getMediaLibrary({ id, errorConfig: params });
  onCallback?.(res);
  return res;
});
export const getMediaByFolderId = createAsyncThunk<
  any,
  {
    id: string;
    params?: Record<string, any>;
    errorConfig?: CustomErrorType;
    onCallback?: (...args: any) => void;
  }
>(`/getFolderMedia`, async ({ id, params, errorConfig, onCallback }) => {
  const res = await getFolderMedia({ id, params, errorConfig });
  onCallback?.(res);
  return res;
});
export const getPaginatedMediaByFolderId = createAsyncThunk<
  any,
  {
    id: string;
    params?: Record<string, any>;
    errorConfig?: CustomErrorType;
    onCallback?: (...args: any) => void;
  }
>(
  `/getPaginatedFolderMedia`,
  async ({ id, errorConfig, params, onCallback }) => {
    const res = await getFolderMedia({ id, params, errorConfig });
    onCallback?.(res);
    return res;
  },
);
export const getSingleFolder = createAsyncThunk<
  any,
  {
    id: string;
    params?: CustomErrorType;
    onCallback?: (...args: any) => void;
  }
>(`/getSingleFolder`, async ({ id, params, onCallback }) => {
  const res = await getMediaFolder({ id, errorConfig: params });
  onCallback?.(res);
  return res;
});
export const uploadMediaLibrary = createAsyncThunk<
  any,
  {
    folderId: string;
    files: MediaType[];
    params?: CustomErrorType;
    onCallback?: (...args: any) => void;
    options?: AxiosRequestConfig;
  }
>(
  `/uploadMediaLibrary`,
  async ({ files, folderId, params, options, onCallback }) => {
    const res = await createMedia({
      folderId,
      files,
      errorConfig: params,
      options,
    });
    onCallback?.(res);
    return { ...res, folderId };
  },
);
export const moveLibrary = createAsyncThunk<
  any,
  {
    itemsIndex?: string[];

    data?: any;
    params?: CustomErrorType;
    options?: AxiosRequestConfig;
    onCallback?: (...args: any) => void;
  }
>(
  `/moveLibraryMedia`,
  async (
    {
      data = { ids: [], folderId: '' },
      itemsIndex,
      params,
      onCallback,
      options,
    },
    state,
  ) => {
    const res = await moveLibraryMedia({ data, errorConfig: params, options });
    onCallback?.(res);
    return { res, data, itemsIndex };
  },
);
export const MedialibraryFilesSlice = createSlice({
  name: 'libraryFileUpload',
  initialState,
  reducers: {
    resetMediaLibraryState: (state) => {
      return initialState;
    },
    resetSelectedItems: (state) => {
      state.selectedMediaItems = undefined;
      state.existingSharedMediasSelected = {};
    },
    removeLibraryItem: (state, action) => {
      const folderId = action.payload.folderId;
      if (folderId === state.activeFolder?._id) {
        const index = action.payload.index;
        const isElementExist = state.activeLibrary?.items?.[index];
        if (isElementExist && action.payload?.itemId === isElementExist?._id) {
          delete state.existingSharedMediasSelected?.[isElementExist._id || ''];
          delete state.existingSharedMediasSelected?.[isElementExist._id || ''];
          state.activeLibrary?.items.splice(index, 1);
          state.activeLibrary!.totalCount =
            (state.activeLibrary?.totalCount || 1) - 1;
        } else {
          const fndindex =
            state.activeLibrary?.items?.findIndex(
              (f) => f._id === action.payload.itemId,
            ) || -1;
          if (fndindex !== -1) {
            const item = state.activeLibrary?.items[fndindex];
            delete state.existingSharedMediasSelected?.[item?._id || ''];
            delete state.existingSharedMediasSelected?.[item?._id || ''];
            state.activeLibrary?.items.splice(fndindex, 1);
            state.activeLibrary!.totalCount =
              (state.activeLibrary?.totalCount || 1) - 1;
          }
        }
      }
    },
    addLibraryItem: (state, action) => {
      // const index = action.payload.index;
      // const folderId = action.payload.folderId;
      // if (index !== -1 && folderId === state.activeFolder?._id) {
      //   state.activeLibrary?.items.splice(index, 0, action.payload?.item);
      //   state.activeLibrary!.totalCount =
      //     (state.activeLibrary?.totalCount || 1) + 1;
      // }
    },
    resetActiveLibrary: (state) => {
      state.activeLibrary = { items: [], totalCount: 0 };
      state.selectedMediaItems = undefined;
      state.existingSharedMediasSelected = {};
      state.alreadySharedMediaIds = {};
      state.libraryMedia = [];
    },
    resetActiveFolder: (state) => {
      state.activeFolder = undefined;
    },
    setLibraryLoading: (state, action) => {
      state.libraryLoading = action?.payload?.loading;
    },
    setItemsDragging: (state, action) => {
      state.itemsDragging = action?.payload;
    },
    setActiveFolder: (state, action) => {
      state.activeFolder = action.payload;
    },
    setActiveLibrary: (state, action) => {
      state.activeLibrary = action.payload;
    },
    removeFromSelectedMedia: (state, action) => {
      const folderId = action.payload.folderId;
      const itemId = action.payload.itemId;

      if (state.activeFolder?._id === folderId) {
        delete state.selectedMediaItems?.[itemId];
        delete state.existingSharedMediasSelected?.[itemId];
      }
    },
    removeFromSelectedMediaandUpdateSort: (state, action) => {
      const folderId = action.payload.folderId;
      const itemId = action.payload.itemId;
      const itemIndex = action.payload.index;

      if (state.activeFolder?._id === folderId && state.selectedMediaItems) {
        delete state.alreadySharedMediaIds?.[itemId];
        delete state.existingSharedMediasSelected?.[itemId];
        const selectedItems = { ...(state.selectedMediaItems || {}) };
        delete selectedItems?.[itemId];
        const items = Object.values(selectedItems || {});
        let newItems: any;
        if (!!items?.length) {
          const lastelement: any = items[items?.length - 1];
          if (lastelement?.index > itemIndex) {
            newItems = {};
            items.forEach((item: any) => {
              const newItem = { ...item };
              if (item?.index > itemIndex) {
                newItem.index = (newItem?.index || 1) - 1;
              }
              newItems[item._id || ''] = newItem;
            });
          } else {
            newItems = selectedItems;
          }
        }
        state.selectedMediaItems = newItems;
      }
    },
    addMediaToSelectedMedias: (state, action) => {
      const id = action.payload?.item?._id;

      if (state.selectedMediaItems) {
        const selectedMedias = { ...(state.selectedMediaItems || {}) };
        if (action.payload.isChecked) {
          selectedMedias[id] = action.payload?.item;
          if (state.alreadySharedMediaIds?.[id]) {
            state.existingSharedMediasSelected = {
              ...(state.existingSharedMediasSelected || {}),
              [id]: id,
            };
          }
        } else {
          delete selectedMedias[id];
          delete state.existingSharedMediasSelected?.[id];
        }
        const items = Object.values(selectedMedias || {});
        let newItems: any;
        if (!!items?.length) {
          newItems = {};
          const sortedItems = items.sort(
            (a: any, b: any) => a?.index - b?.index,
          );
          sortedItems.forEach((item) => {
            newItems[item._id || ''] = item;
          });
        }
        state.selectedMediaItems = newItems;
      } else {
        if (id) {
          if (action.payload.isChecked) {
            state.selectedMediaItems = {
              ...(state.selectedMediaItems || {}),
              [id]: action.payload.item,
            };
            if (state.alreadySharedMediaIds?.[id]) {
              state.existingSharedMediasSelected = {
                ...(state.existingSharedMediasSelected || {}),
                [id]: id,
              };
            }
          } else {
            delete state.selectedMediaItems?.[id];
            delete state.existingSharedMediasSelected?.[id];
          }
        }
      }
    },
    onFilesUpload: (state, action: { payload: IMedialibraryFilesType }) => {
      state.libraryMedia = action.payload.libraryMedia;
    },
    addInProgressGellaryId: (state, action) => {
      state.inProgressGellaryId![action.payload] = action.payload;
    },
    removeInProgressGellaryId: (state, action) => {
      delete state.inProgressGellaryId![action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLibraryFolder.fulfilled, (state, action) => {
      state.libraryList = action.payload;
    });
    builder.addCase(updateLibraryFolderName.fulfilled, (state, action) => {
      const updatedState = [...(state.libraryList?.items || [])];
      const data: any = action.payload;
      const index = updatedState?.findIndex((lib) => lib?._id === data?._id);
      if (index !== -1) {
        state.libraryList!.items[index] = data;
        const updateActiveFolder = { ...(state.activeFolder || {}) };
        if (updateActiveFolder._id === data?._id) {
          state.activeFolder = { ...data, index };
        }
      }
    });
    builder.addCase(createLibraryFolderName.fulfilled, (state, action) => {
      state.libraryList?.items.unshift(action.payload);
      state.libraryList!.totalCount = (state.libraryList?.totalCount || 0) + 1;
    });
    builder.addCase(getSingleLibrary.fulfilled, (state, action) => {});
    builder.addCase(getSingleFolder.fulfilled, (state, action) => {});
    builder.addCase(uploadMediaLibrary.fulfilled, (state, action) => {
      const libraryItems = action.payload?.data || [];
      if (
        action.payload.folderId === state.activeFolder?._id &&
        !!libraryItems?.length
      ) {
        state.activeLibrary!.items = [
          ...(action.payload.data || []),
          ...(state.activeLibrary?.items || []),
        ];
        state.activeLibrary!.totalCount =
          (state.activeLibrary?.totalCount || 0) +
          ((action.payload.data || [])?.length || 1);
        if (state.selectedMediaItems) {
          const selectedItems = { ...(state.selectedMediaItems || {}) };
          const items = Object.values(selectedItems || {});

          let newItems: any;
          if (!!items.length) {
            newItems = {};
            items.forEach((item: any) => {
              const newItem = { ...item };

              newItem.index =
                (newItem?.index || 0) + action.payload.data?.length;

              newItems[item._id || ''] = newItem;
            });
            state.selectedMediaItems = newItems;
          }
        }
      }
    });
    builder.addCase(getMediaByFolderId.fulfilled, (state, action) => {
      state.activeLibrary = action.payload;
      const ids = action.payload?.alreadyExist || [];
      const alreadySharedMediaIds: Record<string, string> = {};
      ids.forEach((id: string) => {
        alreadySharedMediaIds[id] = id;
      });
      state.alreadySharedMediaIds = alreadySharedMediaIds;
    });
    builder.addCase(getPaginatedMediaByFolderId.fulfilled, (state, action) => {
      if (!!action.payload.items?.length) {
        state.activeLibrary!.totalCount = action.payload.totalCount;
        state.activeLibrary!.items = [
          ...(state.activeLibrary?.items || []),
          ...action.payload.items,
        ];
        const ids = action.payload?.alreadyExist || [];
        const updatedIds = { ...(state.alreadySharedMediaIds || {}) };
        ids.forEach((id: string) => {
          updatedIds[id] = id;
        });
        state.alreadySharedMediaIds = updatedIds;
      }
      // state.libraryList?.items.push()

      // state.activeLibrary = action.payload;
    });
    builder.addCase(moveLibrary.fulfilled, (state, action) => {
      let itemsArray = [...action?.payload?.itemsIndex];
      state.activeLibrary!.totalCount =
        state.activeLibrary!.totalCount - itemsArray.length;
      for (let index = 0; index < itemsArray.length; index++) {
        state.activeLibrary!.items = state.activeLibrary!.items?.filter(
          (ele) => {
            if (!!state.selectedMediaItems?.[itemsArray[index]]) {
              delete state.selectedMediaItems?.[itemsArray[index]];
            }
            return itemsArray[index] !== ele?._id;
          },
        );
      }
    });
    builder.addCase(deleteFolderWithMedia.fulfilled, (state, action) => {
      const index = (state.activeFolder as any).index;
      if (
        index !== -1 &&
        state.libraryList?.items?.[index]?._id === state.activeFolder?._id
      ) {
        if (index !== 0) {
          state.activeFolder = {
            ...state.libraryList?.items?.[index - 1],
            index: index - 1,
          } as any;
        } else {
          const nextitems = state.libraryList?.items?.[index + 1];
          if (nextitems) {
            state.activeFolder = {
              ...state.libraryList?.items[index + 1],
              index: index,
            } as any;
          }
        }
        state.libraryList?.items.splice(index, 1);
        state.libraryList!.totalCount =
          (state.libraryList?.totalCount || 1) - 1;
      } else {
        const newItemIndex = [...(state.libraryList?.items || [])]?.findIndex(
          (f) => f._id === state.activeFolder?._id,
        );
        if (newItemIndex !== -1) {
          if (newItemIndex !== 0) {
            state.activeFolder = {
              ...state.libraryList?.items?.[newItemIndex - 1],
              index: index - 1,
            } as any;
          } else {
            const nextItem = state.libraryList?.items[newItemIndex + 1];
            if (nextItem) {
              state.activeFolder = {
                ...nextItem,
                index: index,
              } as any;
            }
          }
          state.libraryList?.items.splice(newItemIndex, 1);
          state.libraryList = {
            items: state.libraryList?.items || [],
            totalCount: (state.libraryList?.totalCount || 1) - 1,
          };
        }
      }
    });
    builder.addCase(deleteMediaInLibrary.fulfilled, (state, action) => {
      const folderId = action.payload.folderId;
      const itemIndex = action.payload.index;
      const itemId = action.payload.mediaId;
      delete state.selectedMediaItems?.[itemId];
      if (state.activeFolder?._id === folderId) {
        const item = state.activeLibrary?.items?.[itemIndex];
        if (item?._id === itemId) {
          state.activeLibrary?.items.splice(action?.payload?.index, 1);
        } else {
          const index = state.activeLibrary?.items?.findIndex(
            (item) => item._id === itemId,
          );
          if (index) {
            state.activeLibrary?.items.splice(index, 1);
          }
        }
        state.activeLibrary!.totalCount =
          (state.activeLibrary?.totalCount || 1) - 1;
      }
    });
    builder.addCase(deleteMediaInTrashLibrary.fulfilled, (state, action) => {
      const folderId = action.payload.folderId;
      const itemIndex = action.payload.index;
      const itemId = action.payload.mediaId;
      if (state.activeFolder?._id === folderId) {
        const item = state.activeLibrary?.items?.[itemIndex];
        if (item?._id === itemId) {
          state.activeLibrary?.items.splice(action?.payload?.index, 1);
        } else {
          const actLibrary = [...(state.activeLibrary?.items || [])];
          const index = actLibrary.findIndex((item) => item._id === itemId);
          if (index !== -1) {
            state.activeLibrary?.items.splice(index, 1);
          }
        }
        state.activeLibrary!.totalCount =
          (state.activeLibrary?.totalCount || 1) - 1;
      }
    });
    builder.addCase(updateFolderMediaItem.fulfilled, (state, action) => {
      const folderId = action.payload.folderId;
      let itemIndex = action.payload.index;
      const itemId = action.payload.id;

      if (state.activeFolder?._id === folderId) {
        let item = state.activeLibrary?.items?.[itemIndex];
        if (item && item?._id === itemId) {
          item.updatedAt = action.payload.updatedAt;
          state.activeLibrary!.items[itemIndex] = item;
          if (!!state.selectedMediaItems?.[itemId]) {
            state.selectedMediaItems[itemId].updatedAt = item.updatedAt;
          }
        } else {
          item = undefined;
          itemIndex = -1;
          const actLibrary = [...(state.activeLibrary?.items || [])];
          itemIndex = actLibrary.findIndex((item) => item._id === itemId);
          if (itemIndex !== -1) {
            item = state.activeLibrary?.items?.[itemIndex];
          }
        }
        if (!!item) {
          item.updatedAt = action.payload.updatedAt;
          state.activeLibrary!.items[itemIndex] = item;
          if (!!state.selectedMediaItems?.[itemId]) {
            state.selectedMediaItems[itemId].updatedAt = item.updatedAt;
          }
        }
      }
    });
  },
});
const groups = (state: RootState) => {
  return state.libraryMedia.selectedMediaItems;
};
const folderCounts = (state: RootState) => {
  return state.libraryMedia.libraryList;
};
const inProgressGroups = (state: RootState) => {
  return state.libraryMedia.inProgressGellaryId;
};
const alreadysharedMedia = (state: RootState) => {
  return state.libraryMedia.alreadySharedMediaIds;
};
const libraryMedia = (state: RootState) => {
  return state.libraryMedia.libraryMedia;
};

export const selectAlreadySharedmedia = createSelector(
  [alreadysharedMedia, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return groups?.[groupKey];
  },
);
export const selectMediaItemBykey = createSelector(
  [groups, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return groups?.[groupKey];
  },
);
export const selectinProgressGroupsItemBykey = createSelector(
  [inProgressGroups, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return groups?.[groupKey];
  },
);
export const selectgroupByKey = createSelector(
  [groups, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return groups?.[groupKey] ? groups : undefined;
  },
);
export const checkIfFilesareReadytoUpload = createSelector(
  [libraryMedia, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return !!groups?.length;
  },
);
export const checkifOneOrMoreFolderExist = createSelector(
  [folderCounts, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return (groups?.totalCount || 1) > 1;
  },
);
// Extract the action creators object and the reducer
const { actions, reducer } = MedialibraryFilesSlice;

export const {
  onFilesUpload,
  addInProgressGellaryId,
  removeInProgressGellaryId,
  setActiveFolder,
  setItemsDragging,
  setLibraryLoading,
  resetMediaLibraryState,
  setActiveLibrary,
  resetActiveLibrary,
  addMediaToSelectedMedias,
  resetSelectedItems,
  removeLibraryItem,
  addLibraryItem,
  removeFromSelectedMedia,
  removeFromSelectedMediaandUpdateSort,
  resetActiveFolder,
} = actions;

// Other code such as selectors can use the imported `RootState` type

export default reducer;
