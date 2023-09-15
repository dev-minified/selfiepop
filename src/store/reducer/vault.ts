import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getOrdersList, getUserNotPurchaseServices } from 'api/Order';
import { getSubscriptionById } from 'api/sales';
import { getUnlockMedia } from 'api/vault';
import { AxiosRequestConfig } from 'axios';
import { RootState } from 'store/store';

const modelName = 'unlock-media-vault';
type T = { items: UnloackMedia[]; totalCount: number };
type UserOrderType = { items?: IOrderUserType[]; totalCount: number };
export interface IState {
  loading: boolean;
  activeType: string;
  media: T;
  selectedUser?: IOrderUserType;
  isVaultUsersFeting?: boolean;
  isFetchingSubscription?: boolean;
  selectedSubscription?: ChatSubsType;

  vaultusersList: { items: IOrderUserType[]; totalCount: number };
  vaultordersListNotPurchased: {
    service: { items: IOrderType[]; totalCount: number };
  };
  vaultUserObjectList: { items: Record<string, any>; totalCount: number };
  alreadyFetchedUsers: {
    items: Record<string, IOrderUserType>;
    totalCount: number;
  };
}

const initialState: IState = {
  loading: false,
  activeType: '',
  media: { items: [], totalCount: 0 },
  selectedUser: {},
  isVaultUsersFeting: false,
  isFetchingSubscription: false,
  vaultusersList: {
    items: [],
    totalCount: 0,
  },
  vaultordersListNotPurchased: {
    service: { items: [], totalCount: 0 },
  },
  vaultUserObjectList: {
    items: {},
    totalCount: 0,
  },
  alreadyFetchedUsers: { items: {}, totalCount: 0 },
  selectedSubscription: undefined,
};
export const getVaultUsersList = createAsyncThunk<
  {
    data: UserOrderType;
    defaultOrder?: string;
    params?: Record<string, any>;
    isInitial: boolean;
    firstSelect?: boolean;
  },
  {
    firstSelect?: boolean;
    defaultOrder?: string;
    params?: Record<string, any>;
    callback?: (...args: any) => void;
    options?: AxiosRequestConfig;
    isInitial?: boolean;
  }
>(
  'vault/getValultUserList',
  async ({
    defaultOrder,
    params,
    callback,
    options,
    isInitial,
    firstSelect,
  }) => {
    const data = await getOrdersList(params, options);
    callback?.(data);
    return {
      data,
      defaultOrder,
      isInitial: isInitial ?? !params?.skip,
      firstSelect,
    };
  },
);
export const getVaultSubscription = createAsyncThunk<
  { data: any },
  {
    subscriptionId: string;
    callback?: (...args: any) => void;
    options?: Record<string, any>;
    customError?: { ignoreStatusCodes: number[] };
  }
>(
  'vault/getVaultSubscription',
  async ({ subscriptionId, callback, options = {}, customError }) => {
    const response = await getSubscriptionById(
      subscriptionId,
      options,
      customError,
    );
    callback?.(response);
    return { data: response, _id: subscriptionId };
  },
);
export const getVaultUser = createAsyncThunk<
  {
    data: UserOrderType;
    userId: string;
    type: string;
    popType: string;
  },
  {
    userId: string;
    type: string;
    popType: string;
  }
>('vault/getVaultUser', async ({ userId, type, popType }) => {
  const data = await getOrdersList({
    userId,
    type: type,
    popType: popType,
  });
  return { data, userId, type, popType };
});
export const getUnlockMediaVault = createAsyncThunk<
  T,
  { params?: Record<string, any>; sellerId: string; type?: string }
>(`${modelName}/getUnlockMedia`, async ({ sellerId, type, params }) => {
  const res = await getUnlockMedia(sellerId, type, params);
  return res.media;
});
export const getVaultUserOrderNotPurchaseService = createAsyncThunk<
  {
    data?: any;
    params?: Record<string, any>;
    isInitial: boolean;
  },
  {
    userId: string;
    callback?: (...args: any) => void;
    params?: Record<string, any>;
  }
>(
  'vault/getVaultUserOrderNotPurchaseService',
  async ({ userId, callback, params }) => {
    const response = await getUserNotPurchaseServices(userId, params);

    callback?.(response);
    return { data: response, isInitial: !params?.skip };
  },
);
export const slice = createSlice({
  name: modelName,
  initialState,
  reducers: {
    setVaultMedia: (state, action) => {
      state.media = action.payload;
      state.selectedSubscription = undefined;
      state.vaultordersListNotPurchased =
        initialState.vaultordersListNotPurchased;
    },
    resetSpecificVaultState: (state) => {
      state.media = { items: [], totalCount: 0 };
      state.selectedSubscription = undefined;
      state.vaultordersListNotPurchased =
        initialState.vaultordersListNotPurchased;
    },
    setVaultUsers: (state, action) => {
      state.vaultusersList = action.payload;
    },
    setVaultSub: (state, action) => {
      state.selectedSubscription = action.payload;
    },
    setUpdateVault: (state, action) => {
      // state.item = [...state];
    },
    setVaultUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSelectedVaultType: (state, action) => {
      state.activeType = action.payload;
    },
    resetVaultState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUnlockMediaVault.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnlockMediaVault.fulfilled, (state, action) => {
        const media = state?.media?.items || [];
        state.media = {
          items: [...media, ...(action.payload?.items || [])],
          totalCount: action.payload?.totalCount || 0,
        };
        state.loading = false;
      })
      .addCase(getUnlockMediaVault.rejected, (state) => {
        state.loading = false;
      });
    builder.addCase(getVaultUsersList.pending, (state, action) => {
      state.isVaultUsersFeting = true;
    });
    builder.addCase(getVaultUsersList.rejected, (state, action) => {
      state.isVaultUsersFeting = false;
    });
    builder.addCase(getVaultUsersList.fulfilled, (state, action) => {
      // Add user to the state array

      if (action.payload.data?.totalCount) {
        const userArrayObject = action?.payload?.data;
        let obj: any = { ...(state.alreadyFetchedUsers || {}) };
        let userListObj: any = {
          ...(state.vaultUserObjectList || { items: {}, totalCount: 0 }),
        };
        if (action.payload.isInitial) {
          state.vaultusersList.items = userArrayObject?.items || ([] as any);
          state.vaultusersList.totalCount = userArrayObject?.totalCount || 0;
          obj = { totalCount: 0 };
          userListObj = { items: {}, totalCount: userArrayObject.totalCount };
          userArrayObject.items?.forEach((a) => {
            userListObj.items[a._id as any] = a;
          });
          state.alreadyFetchedUsers = obj;
          state.vaultUserObjectList = userListObj;
        } else {
          const newItems = action.payload?.data?.items;
          const itemstoSave: any = [];

          newItems?.forEach((a) => {
            const isExist = userListObj.items[a._id as any];
            userListObj.items[a._id as any] = a;

            if (!!obj[a._id as any]) {
              delete obj[a._id as any];
              obj.totalCount = obj.totalCount - 1 > -1 ? obj.totalCount : 0;
            } else {
              if (!isExist) {
                itemstoSave.push(a);
              }
            }
          });
          state.vaultusersList.items = [
            ...(state.vaultusersList.items || []),
            ...(itemstoSave || []),
          ];
          state.vaultUserObjectList = userListObj;
          state.alreadyFetchedUsers = obj;
        }
        // need to do
      }
      state.isVaultUsersFeting = false;
    });
    builder.addCase(getVaultUser.fulfilled, (state, action) => {
      // Add user to the state array
      const item = action?.payload?.data?.items?.[0];

      const usersObjs = {
        ...(state.vaultUserObjectList || { items: {}, totalCount: 0 }),
      };
      if (!usersObjs?.items?.[item?._id || '']) {
        const stateItems = [...(state.vaultusersList.items || [])];
        usersObjs.items[item?._id as any] = item;
        // usersObjs.totalCount = action?.payload?.data.totalCount;
        state.vaultUserObjectList = usersObjs;
        stateItems.unshift(item as any);
        state.vaultusersList.items = stateItems;
        state.alreadyFetchedUsers = {
          ...state.alreadyFetchedUsers,
          [item?._id as any]: item,
          totalCount: (state.alreadyFetchedUsers.totalCount || 0) + 1,
        };
      }
    });
    builder.addCase(getVaultSubscription.rejected, (state, action) => {
      state.isFetchingSubscription = false;
    });
    builder.addCase(getVaultSubscription.fulfilled, (state, action) => {
      state.isFetchingSubscription = false;
      state.selectedSubscription = action.payload.data;
    });
    builder.addCase(getVaultSubscription.pending, (state, action) => {
      state.isFetchingSubscription = true;
    });
    builder.addCase(
      getVaultUserOrderNotPurchaseService.fulfilled,
      (state, action) => {
        if (action.payload.isInitial) {
          state.vaultordersListNotPurchased.service = action.payload.data;
        } else {
          state.vaultordersListNotPurchased.service = {
            items: [
              ...state.vaultordersListNotPurchased.service.items,
              ...action.payload.data.items,
            ],
            totalCount: action.payload.data.totalCount,
          };
        }
        // state.isPostsFetching = false;
      },
    );
    builder.addCase(
      getVaultUserOrderNotPurchaseService.pending,
      (state, action) => {
        // state.isPostsFetching = true;
      },
    );
    builder.addCase(
      getVaultUserOrderNotPurchaseService.rejected,
      (state, action) => {
        // state.isPostsFetching = false;
      },
    );
  },
});
const SelectUserObjectList = (state: RootState) =>
  state.vault.vaultUserObjectList;
// Extract the action creators object and the reducer
export const selectVaultUserObjectList = createSelector(
  [SelectUserObjectList],
  (obj) => {
    return obj as IState['vaultUserObjectList'];
  },
);
export const {
  setVaultMedia,
  resetVaultState,
  setSelectedVaultType,
  setVaultUser,
  setVaultSub,
  setVaultUsers,
  resetSpecificVaultState,
} = slice.actions;

// Extract the action creators object and the reducer

export default slice.reducer;
