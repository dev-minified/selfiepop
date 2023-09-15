//// Example
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  getOrder,
  getOrdersList,
  getUserNotPurchaseCourse,
  getUserNotPurchaseServices,
  getUserOrders,
} from 'api/Order';
// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootStimport { User } from './../../assets/svgs/index';
// ate) => state.support;import { dayjs } from 'dayjs';
import { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { AppDispatch, RootState } from 'store/store';

import {
  getMemberShipsByUserId,
  GetMembershipsTiers,
  getYouMayknowUsers,
  payForMembership,
  payForMembershipUpgrade,
} from 'api/sales';
import { IFileGroup } from './files';
// Define a type for the slice state

type YoumayknowUser = {
  _id?: string;
  profileImage: string;
  username: string;
  pageTitle: string;
  chatLink: Record<string, any>;
};

type UserOrderType = { items?: IOrderUserType[]; totalCount: number };
interface MySalesState {
  // selectedUser?: IOrderUserType | null;
  selectedSubscription?: ChatSubsType | null;
  pendingMessages: (ChatMessage & {
    messageMedia: (ChatMessage['messageMedia'][number] &
      IFileGroup['files'][number])[];
    isSent?: boolean;
  })[];
  pendingEditMessages: (ChatMessage & {
    messageMedia: (ChatMessage['messageMedia'][number] &
      IFileGroup['files'][number])[];
    isSent?: boolean;
  })[];
  filteredSchdulePost: any[];

  ordersList?: {
    orders: { items: IOrderType[]; totalCount: number };
    pops?: { items: IOrderType[]; totalCount: number };
  };
  ordersListNotPurchased: {
    course: { items: IOrderType[]; totalCount: number };
    service: { items: IOrderType[]; totalCount: number };
  };
  youmayknowusers?: YoumayknowUser[];
  isYoumayknowFetching?: boolean;
  usersList: { items: string[]; totalCount: number };
  alreadyFetchedUsers: {
    items: Record<string, IOrderUserType>;
    totalCount: number;
  };
  userObjectList: { items: Record<string, IOrderUserType>; totalCount: number };
  userMemberships?: IPostMemberships;
  subscriptionId?: string | null;
  isMemberShipsFetching?: boolean;
  isContentAccess?: boolean;
  isPostsFetching?: boolean;
  isUserOrdersFetching?: boolean;
  isUserListFetching?: boolean;
  issubIdFetching?: boolean;
  issubFetching?: boolean;
  isMemberShipUpgrading?: boolean;
  isOrderFetching?: boolean;
  isAllowMessages?: boolean;
  isUpgradingMemberShip?: boolean;
  selectedOrder?: IOrderType;
  isUsersFetched?: boolean;
  isChatWindowActive?: boolean;
  unlockPostId?: string;
  upgradePostId?: string;
}

// Define the initial state using that type
const initialState: MySalesState = {
  selectedSubscription: null,
  subscriptionId: null,
  // selectedUser: null,
  pendingMessages: [],
  pendingEditMessages: [],
  filteredSchdulePost: [],
  isUsersFetched: false,
  isYoumayknowFetching: false,
  userObjectList: { items: {}, totalCount: 0 },
  alreadyFetchedUsers: { items: {}, totalCount: 0 },
  ordersList: {
    orders: { items: [], totalCount: 0 },
    pops: { items: [], totalCount: 0 },
  },
  ordersListNotPurchased: {
    course: { items: [], totalCount: 0 },
    service: { items: [], totalCount: 0 },
  },
  youmayknowusers: [],
  usersList: {
    items: [],
    totalCount: 0,
  },
  userMemberships: {},
  isMemberShipsFetching: false,
  isUpgradingMemberShip: false,
  isAllowMessages: true,

  isPostsFetching: false,
  isContentAccess: false,
  isMemberShipUpgrading: false,
  selectedOrder: {},
  isOrderFetching: false,
  isUserOrdersFetching: false,
  isUserListFetching: false,
  issubIdFetching: false,
  issubFetching: false,
  isChatWindowActive: false,
};

export const getSelectedOrder = createAsyncThunk<
  {
    data: MySalesState['selectedOrder'];
  },
  {
    orderId?: string;
    callback?: (...args: any) => void;
    customError?: { ignoreStatusCodes: [number] };
  }
>('sale/getOrder', async ({ orderId, callback, customError }) => {
  const response = await getOrder(orderId || '', null, customError);
  callback?.(response);
  return { data: response };
});
export const getPeopleYoumayknow = createAsyncThunk<
  {
    data: MySalesState['youmayknowusers'];
  },
  {
    callback?: (...args: any) => void;
    customError?: CustomErrorType;
    options?: AxiosRequestConfig;
  }
>('sale/getPeopleYoumayknow', async ({ callback, customError, options }) => {
  const response = await getYouMayknowUsers(customError, options);
  callback?.(response);
  return response;
});
export const getUsersList = createAsyncThunk<
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
  'sale/getUserList',
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
export const getSubItem = createAsyncThunk<
  {
    data: UserOrderType;
    userId: string;
    type: string;
    popType: string;
    subId: string;
    insertatbeginning?: boolean;
  },
  {
    userId: string;
    type: string;
    popType: string;
    subId: string;

    insertatbeginning?: boolean;
  }
>(
  'sale/getSubItem',
  async ({ userId, type, popType, subId, insertatbeginning }) => {
    const data = await getOrdersList({
      userId,
      type: type,
      popType: popType,
    });
    return { data, userId, subId, type, popType, insertatbeginning };
  },
);
export const getAndInsertAtFirst = createAsyncThunk<
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
>('sale/getAndInsertAtFirst', async ({ userId, type, popType }) => {
  const data = await getOrdersList({
    userId,
    type: type,
    popType: popType,
  });
  return { data, userId, type, popType };
});

export const getUserMemberships = createAsyncThunk<
  {
    data: MySalesState['userMemberships'];
  },
  {
    params?: Record<string, any>;
    callback?: (...args: any) => void;
    customError?: { ignoreStatusCodes: number[] };
    options?: AxiosRequestConfig;
  }
>(
  'sale/postMemberships',
  async ({ params, callback, customError, options }) => {
    const data = await GetMembershipsTiers(params, customError, options);
    callback?.(data);
    return { data, isInitial: !params?.skip };
  },
);

export const paymentForMembership = createAsyncThunk<
  {
    data: any;
    postId: string;
  },
  {
    postId: string;
    membershipId: string;
    dispatch: AppDispatch;
  }
>('sale/paymentForMembership', async ({ postId, membershipId, dispatch }) => {
  const data = await payForMembership(postId, membershipId, dispatch);
  return { data, postId };
});

export const paymentForMembershipUpgrade = createAsyncThunk<
  {
    data: any;
    subId: string;
  },
  {
    subId: string;
    membershipId: string;
    dispatch: AppDispatch;
  }
>(
  'sale/paymentForMembershipUpgrade',
  async ({ subId, membershipId, dispatch }) => {
    const data = await payForMembershipUpgrade(subId, membershipId, dispatch);
    return { data, subId };
  },
);

export const getUserMembershops = createAsyncThunk<
  {
    data: IPostCommentType;
    params?: Record<string, any>;
    _id: string;
    isInitial: boolean;
  },
  {
    id: string;
    params?: Record<string, any>;
    callback?: (...args: any) => void;
    customError?: { ignoreStatusCodes: [number] };
  }
>('sale/userpostmemberships', async ({ id, params, callback, customError }) => {
  const data = await getMemberShipsByUserId(id, params || {}, customError);
  callback?.(data);
  // return { data: postsData, isInitial: !params?.skip };
  return { data, _id: id, isInitial: !params?.skip };
});

export const getSelectedUserOrders = createAsyncThunk<
  {
    data: MySalesState['ordersList'];
    params?: Record<string, any>;
    isInitial: boolean;
  },
  {
    userId?: string;
    callback?: (...args: any) => void;
    params?: Record<string, any>;
    customError?: { ignoreStatusCodes: number[] };
  }
>('sale/getUsersOrders', async ({ userId, callback, params, customError }) => {
  const response = await getUserOrders(userId || '', params, customError);
  callback?.(response);
  return { data: response, isInitial: !params?.skip };
});

export const getUserOrderNotPurchaseService = createAsyncThunk<
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
  'sale/getUserOrderNotPurchaseService',
  async ({ userId, callback, params }) => {
    const response = await getUserNotPurchaseServices(userId, params);

    callback?.(response);
    return { data: response, isInitial: !params?.skip };
  },
);

export const getUserOrderNotPurchaseCourse = createAsyncThunk<
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
  'sale/getUserOrderNotPurchaseCourse',
  async ({ userId, callback, params }) => {
    const response = await getUserNotPurchaseCourse(userId, params);
    callback?.(response);
    return { data: response, isInitial: !params?.skip };
  },
);
function updateUserOnlineStatus(
  user: IOrderUser,
  isOnline: boolean,
  offlineAt?: string,
) {
  user.isOnline = isOnline;
  if (offlineAt) {
    user.offlineAt = offlineAt || dayjs().format();
  }

  return user;
}
export const MySalesSlice = createSlice({
  name: 'mysales',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUlockPostId: (state, action) => {
      state.unlockPostId = action.payload;
    },
    setPeopleYoumayknow: (state, action) => {
      state.youmayknowusers = action.payload;
    },
    increamentTotalCount: (state) => {
      state.userObjectList.totalCount =
        (state.userObjectList.totalCount || 0) + 1;
      state.usersList.totalCount = (state.usersList.totalCount || 0) + 1;
    },
    filterPeopYoumayKnow: (state, action) => {
      const userId = action.payload?.userId;
      if (userId) {
        const stateusers = state.youmayknowusers;
        const newUers = stateusers?.filter((yp) => yp._id !== userId);
        state.youmayknowusers = newUers;
        action.payload?.callback(newUers);
      }
    },
    setUpgradePostId: (state, action) => {
      state.upgradePostId = action.payload;
    },
    setUserMemberships: (state, action) => {
      state.userMemberships = action.payload;
    },
    reInitializeState: (state) => {
      return initialState;
    },
    setIsUsersFetched: (state, action) => {
      state.isUsersFetched = action.payload;
    },
    updateChatWindowActiveStatus: (state, action) => {
      state.isChatWindowActive = action.payload;
    },

    resetSubId: (state) => {
      state.subscriptionId = undefined;
    },
    setSelectedSub: (state, action) => {
      state.selectedSubscription = action.payload;
    },
    // setSelectedUser: (state, action) => {
    //   if (action.payload === null) {
    //     state.selectedUser = undefined;
    //   } else {
    //     state.selectedUser = { unread: 0, ...action.payload };
    //   }
    // },
    searchUserList: (state, action) => {
      const data = action.payload;
      if (data) {
        state.userObjectList = { items: {}, totalCount: 0 };
        state.usersList.items = data?.items?.map((m: any) => m?._id);
        state.usersList.totalCount = data?.totalCount || 0;
        data?.items?.forEach((m: any) => {
          state.userObjectList.items[m?._id || ''] = m;
          state.userObjectList.totalCount = data.totalCount || 0;
        });
      }
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload || {};
    },
    addPendingMessage: (state, action) => {
      state.pendingMessages.push(action.payload);
    },
    addEditPendingMessage: (state, action) => {
      state.pendingEditMessages.push(action.payload);
    },

    removeMediaFromPendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages?.filter((message) => ({
        ...message,
        ...action.payload,
        messageMedia: message?.messageMedia.filter(
          (m) => m.id !== action.payload.id,
        ),
      }));
    },

    toggleSendMessage: (state, action) => {
      state.isAllowMessages = action?.payload.allowBuyerToMessage;
    },
    toggleContentAccess: (state, action) => {
      state.isContentAccess = action?.payload.isContentAccess;
    },
    removeFromPendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages?.filter((message) => {
        return message?._id !== action.payload?.groupId;
      });
      state.pendingEditMessages = state.pendingEditMessages?.filter(
        (message) => {
          return message?._id !== action.payload?.groupId;
        },
      );
    },
    updatePendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages.map((message) =>
        message._id === action.payload._id
          ? { ...message, ...action.payload }
          : message,
      );
      state.pendingEditMessages = state.pendingEditMessages.map((message) =>
        message._id === action.payload._id
          ? { ...message, ...action.payload }
          : message,
      );
    },

    insertBeginningOfUserList: (state, action) => {
      const SubId: any = action.payload.data?._id;
      const usersub = state.userObjectList?.items?.[SubId || ''];
      if (!usersub) {
        state.usersList.items.unshift(action.payload.data?._id);
        state.userObjectList.items = {
          ...(state.userObjectList?.items || {}),
          [SubId || '']: action.payload.data,
        };
      } else {
        state.userObjectList.items[SubId] = action.payload.data;
      }
    },
    // checkAndInsertAtBeginning: (state, action) => {
    //   const userSubId = action.payload?.data?._id;
    //   const userSub = state.userObjectList?.items?.[userSubId];
    //   const callback = action.payload?.callback;
    //   const incrementCount = action.payload?.incrementCount;
    //   if (!!incrementCount) {
    //     state.userObjectList.totalCount = state.userObjectList.totalCount + 1;
    //     state.usersList.totalCount++;
    //   }
    //   if (!userSub) {
    //     state.userObjectList.items[action.payload.data._id] =
    //       action.payload.data;
    //     state.usersList.items.unshift(action.payload.data);
    //   }
    //   callback?.();
    // },

    resetUsers: (state, action) => {
      state.usersList = { items: [], totalCount: 0 };
      // state.selectedUser = undefined;
      state.selectedSubscription = undefined;
      state.userObjectList = { items: {}, totalCount: 0 };
    },
    setUserOrders: (state, action) => {
      state.ordersList = action.payload || {
        orders: { items: [], totalCount: 0 },
        pops: { items: [], totalCount: 0 },
      };
    },
    setUserListOrders: (state, action) => {
      if (action.payload?.success) {
        const data = action.payload;
        state.userObjectList = { items: {}, totalCount: 0 };
        state.usersList.items = data?.items?.map((m: any) => m?._id);
        state.usersList.totalCount = data?.totalCount || 0;
        data?.items?.forEach((m: any) => {
          state.userObjectList.items[m?._id || ''] = m;
          state.userObjectList.totalCount = data.totalCount || 0;
        });
      } else {
        state.alreadyFetchedUsers = initialState.alreadyFetchedUsers;
        state.usersList = initialState.usersList;
        state.ordersList = initialState.ordersList;
      }

      // state.usersList = action.payload || {
      //   orders: { items: [], totalCount: 0 },
      //   pops: { items: [], totalCount: 0 },
      // };
    },
    updateUserOrders: (state, action) => {
      const orderIndex: any = state.ordersList?.orders?.items?.findIndex(
        (o: any) => o._id === action.payload?.orderId,
      );
      if (orderIndex > -1) {
        state.ordersList!.orders.items[orderIndex] = action.payload?.order;
      }
      state.ordersList = {
        orders: {
          items: state.ordersList?.orders?.items || [],
          totalCount: state.ordersList?.orders?.items.length || 0,
        },
        ...state.ordersList?.pops,
      };
    },
    updateUserOrdersByStatus: (state, action) => {
      state.ordersList = {
        orders: {
          items:
            state.ordersList?.orders?.items?.map((o: any) =>
              o._id === action.payload.orderId
                ? { ...o, orderStatus: action.payload.status }
                : o,
            ) || [],
          totalCount:
            state.ordersList?.orders?.items?.map((o: any) =>
              o._id === action.payload.orderId
                ? { ...o, orderStatus: action.payload.status }
                : o,
            ).length || 0,
        },
        ...state.ordersList?.pops,
      };
    },
    updateUsersUnreadCount: (state, action) => {
      if (
        state.selectedSubscription?._id !== action.payload?.subscriptionId ||
        (state.selectedSubscription?._id === action.payload?.subscriptionId &&
          !action.payload?.isChatWindowActive)
      ) {
        const subId = action?.payload?.subscriptionId;
        const userSub = state.userObjectList?.items?.[subId];
        if (!!userSub) {
          userSub.unread = (userSub?.unread || 0) + 1;
          state.userObjectList.items[subId] = userSub;
          const index = state?.usersList?.items.findIndex(
            (item) => item === action?.payload?.subscriptionId,
          );
          const Top = state?.usersList?.items[index];
          state?.usersList?.items?.splice(index, 1);
          state?.usersList?.items?.splice(0, 0, Top);
        }
      }
    },
    resetUnreadCount: (state, action) => {
      if (action.payload?.subscriptionId) {
        // if (
        //   state.selectedSubscription?._id &&
        //   state.selectedSubscription?._id !== action.payload?.subscriptionId
        // ) {

        const subId = action?.payload?.subscriptionId;
        const userSub = state.userObjectList?.items?.[subId];
        if (!!userSub) {
          userSub.unread = 0;
          state.userObjectList.items[subId] = userSub;
        }
      }
    },
    setUserUnreadCount: (state, action) => {
      if (action.payload?.subscriptionId) {
        const user =
          state.userObjectList.items?.[action.payload?.subscriptionId];
        if (!!user) {
          // state.selectedUser = {
          //   ...state.selectedUser,
          //   unread: action.payload?.unread || 0,
          // };

          state.userObjectList.items[action?.payload?.subscriptionId].unread =
            action.payload?.unread || 0;
        }
      }
    },
    updateUserLastMessage: (state, action) => {
      if (action.payload?.id) {
        const user = state.userObjectList.items?.[action.payload?.id];
        if (!!user) {
          const sub = user;
          sub.lastMessage = action.payload.message.messageValue;
          sub.lastMessageAt = action.payload.message.createdAt;
          // state.usersList.items[index] = sub;
          state.userObjectList.items[action.payload.id] = sub;
          const index = state.usersList.items.findIndex(
            (item) => item === action.payload.id,
          );
          state.usersList.items.splice(index, 1);
          state.usersList.items.splice(0, 0, sub._id!);
        }
      }
    },
    appendTagInSub: (state, action) => {
      const subId = action?.payload?._id;
      const userSub = state.userObjectList?.items?.[subId];
      if (!!userSub) {
        userSub.tags?.push(action.payload?.tag);
        state.userObjectList.items[subId] = userSub;
      }
    },
    addUserLastMessage: (state, action) => {
      if (state.selectedSubscription?._id) {
        const subId = action?.payload?.id;
        const userSub = state.userObjectList?.items?.[subId];
        if (!!userSub) {
          userSub.tags?.push(action.payload?.tag);
          userSub.lastMessage = action.payload.message.messageValue;
          userSub.lastMessageAt = action.payload.message.createdAt;
          state.userObjectList.items[subId] = userSub;
          const index = state.usersList.items.findIndex(
            (item) => item === action.payload.id,
          );

          state.usersList.items.splice(index, 1);
          state.usersList.items.splice(0, 0, userSub._id!);
        }
      }
    },

    updateOnlineStatus: (state, { payload }) => {
      const { id = '', isSeller, offlineAt } = payload;
      const isOnline = payload.type === 'userOnline';
      if (state?.selectedSubscription?.buyerId?._id === id && isSeller) {
        state.selectedSubscription!.buyerId! = updateUserOnlineStatus(
          state.selectedSubscription!.buyerId!,
          isOnline,
          offlineAt,
        ) as any;
      } else if (state.selectedSubscription?.sellerId?._id === id) {
        state.selectedSubscription!.sellerId! = updateUserOnlineStatus(
          state.selectedSubscription!.sellerId!,
          isOnline,
          offlineAt,
        ) as any;
      }
      state.usersList.items.forEach((user) => {
        const userSub = state.userObjectList.items[user];
        if (isSeller) {
          if (userSub.buyerId?._id === id) {
            userSub.buyerId = updateUserOnlineStatus(
              userSub!.buyerId!,
              isOnline,
              offlineAt,
            );
            state.userObjectList.items[user] = userSub;
          }
        } else {
          if (userSub.sellerId?._id === id) {
            userSub.sellerId = updateUserOnlineStatus(
              userSub!.sellerId!,
              isOnline,
              offlineAt,
            );
            state.userObjectList.items[user] = userSub;
          }
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(paymentForMembershipUpgrade.fulfilled, (state, action) => {
      state.isMemberShipUpgrading = false;
    });
    builder.addCase(paymentForMembershipUpgrade.pending, (state, action) => {
      state.isMemberShipUpgrading = true;
    });
    builder.addCase(paymentForMembershipUpgrade.rejected, (state, action) => {
      state.isMemberShipUpgrading = false;
    });
    builder.addCase(
      getUserOrderNotPurchaseService.fulfilled,
      (state, action) => {
        if (action.payload.isInitial) {
          state.ordersListNotPurchased.service = action.payload.data;
        } else {
          state.ordersListNotPurchased.service = {
            items: [
              ...state.ordersListNotPurchased.service.items,
              ...action.payload.data.items,
            ],
            totalCount: action.payload.data.totalCount,
          };
        }
        // state.isPostsFetching = false;
      },
    );
    builder.addCase(getUserOrderNotPurchaseService.pending, (state, action) => {
      // state.isPostsFetching = true;
    });
    builder.addCase(
      getUserOrderNotPurchaseService.rejected,
      (state, action) => {
        // state.isPostsFetching = false;
      },
    );
    // export const
    builder.addCase(
      getUserOrderNotPurchaseCourse.fulfilled,
      (state, action) => {
        if (action.payload.isInitial) {
          state.ordersListNotPurchased.course = action.payload.data;
        } else {
          state.ordersListNotPurchased.course = {
            items: [
              ...state.ordersListNotPurchased.course.items,
              ...action.payload.data.items,
            ],
            totalCount: action.payload.data.totalCount,
          };
        }
        // state.isPostsFetching = false;
      },
    );
    builder.addCase(getUserOrderNotPurchaseCourse.pending, (state, action) => {
      // state.isPostsFetching = true;
    });
    builder.addCase(getUserOrderNotPurchaseCourse.rejected, (state, action) => {
      // state.isPostsFetching = false;
    });
    //Unlocking Posts

    //Upgrade memeberShip
    builder.addCase(paymentForMembership.fulfilled, (state, action) => {
      state.isUpgradingMemberShip = false;
    });
    builder.addCase(paymentForMembership.pending, (state, action) => {
      state.isUpgradingMemberShip = true;
    });
    builder.addCase(paymentForMembership.rejected, (state, action) => {
      state.isUpgradingMemberShip = false;
    });

    // * Get All posts for specific User

    // * Get All posts for specific User
    builder.addCase(getUserMemberships.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.userMemberships = {
          ...action.payload?.data,
          memberShips: (action?.payload?.data as any)?.meberships || [],
        };
        state.isMemberShipsFetching = false;
      }
    });
    builder.addCase(getUserMemberships.pending, (state, action) => {
      state.isMemberShipsFetching = true;
    });
    builder.addCase(getUserMemberships.rejected, (state, action) => {
      state.isMemberShipsFetching = false;
    });

    // * delete Post

    builder.addCase(getSelectedOrder.pending, (state, action) => {
      state.isOrderFetching = true;
    });
    builder.addCase(getSelectedOrder.rejected, (state, action) => {
      state.isOrderFetching = false;
    });
    builder.addCase(getSelectedOrder.fulfilled, (state, action) => {
      // Add user to the state array
      state.selectedOrder = action.payload.data;
      state.isOrderFetching = false;
    });
    // getUser Orders
    builder.addCase(getSelectedUserOrders.pending, (state, action) => {
      state.isUserOrdersFetching = true;
    });
    builder.addCase(getSelectedUserOrders.rejected, (state, action) => {
      state.isUserOrdersFetching = false;
    });
    builder.addCase(getSelectedUserOrders.fulfilled, (state, action) => {
      // Add user to the state array
      if (action.payload.isInitial) {
        state.ordersList = action.payload.data;
      } else {
        state.ordersList = {
          orders: {
            items: [
              ...(state?.ordersList?.orders?.items || []),
              ...(action?.payload?.data?.orders?.items || []),
            ],
            totalCount: action?.payload?.data?.orders?.totalCount || 0,
          },
          pops: {
            items: [...(action?.payload?.data?.pops?.items || [])],
            totalCount: action?.payload?.data?.pops?.totalCount || 0,
          },
        };
      }
      state.isUserOrdersFetching = false;
    });
    // * getUser Lists
    builder.addCase(getUsersList.pending, (state, action) => {
      state.isUserListFetching = true;
    });
    builder.addCase(getUsersList.rejected, (state, action) => {
      state.isUserListFetching = false;
    });
    builder.addCase(getUsersList.fulfilled, (state, action) => {
      // Add user to the state array
      let usrsObject = { ...state.userObjectList };
      let alreadyFetchUsers = { ...state.alreadyFetchedUsers };
      if (action.payload.data?.totalCount) {
        const userArrayObject = action?.payload?.data;
        if (action.payload.isInitial) {
          alreadyFetchUsers = { items: {}, totalCount: 0 };
          state.alreadyFetchedUsers = alreadyFetchUsers;
          const users: Record<string, IOrderUserType> = {};

          state.usersList.items = !!userArrayObject?.items?.length
            ? userArrayObject?.items?.map((i) => i._id || '')
            : [];
          state.usersList.totalCount = userArrayObject?.totalCount || 0;
          userArrayObject?.items?.forEach((u) => {
            users[u._id || ''] = u;
          });
          usrsObject = { items: users, totalCount: userArrayObject.totalCount };
          state.userObjectList = usrsObject;
        } else {
          const newItems = action.payload?.data?.items?.filter((item) => {
            delete alreadyFetchUsers.items?.[item._id || ''];
            return !state.userObjectList.items?.[item._id || '']?._id;
          });
          const users: Record<string, IOrderUserType> = { ...usrsObject.items };
          userArrayObject?.items?.forEach((u) => {
            users[u._id || ''] = u;
          });
          usrsObject = { items: users, totalCount: userArrayObject.totalCount };
          state.userObjectList = usrsObject;
          state.alreadyFetchedUsers = {
            items: alreadyFetchUsers.items,
            totalCount: Object.keys(alreadyFetchUsers.items || {}).length,
          };
          state.usersList.items = [
            ...(state.usersList.items || []),
            ...(newItems?.map((i) => i._id || '') || []),
          ];
        }
        // need to do
        if (action.payload.firstSelect) {
          const firstId = state.usersList.items?.[0];
          if (action.payload.defaultOrder) {
            const order =
              state.userObjectList.items?.[action.payload.defaultOrder] ||
              state.userObjectList.items?.[firstId || ''];
            // order.unread = 0;
            // state.selectedUser = order;
          } else {
            const order = state.userObjectList.items?.[firstId || ''];
            // order.unread = 0;
            // state.selectedUser = order;
          }
        }
      }
      state.isUserListFetching = false;
    });
    builder.addCase(getSubItem.fulfilled, (state, action) => {
      // Add user to the state array

      const item = action?.payload?.data?.items?.[0];
      const userSub = state.userObjectList?.items?.[item?._id || ''];
      if (!!userSub) {
        const stateItems = [...(state.usersList.items || [])];
        const index = stateItems.findIndex((us) => us === userSub._id);

        if (index !== -1) {
          stateItems.splice(index, 1);
          stateItems.unshift(userSub._id || '');
        }
      } else {
        if (!!item?._id) {
          state.usersList.items.unshift(item._id!);
          state.userObjectList.items[item?._id || ''] = item;
        }
      }
    });
    builder.addCase(getAndInsertAtFirst.fulfilled, (state, action) => {
      // Add user to the state array
      const item = action?.payload?.data?.items?.[0];
      const userSub = state.userObjectList?.items?.[item?._id || ''];
      if (!!userSub) {
        const stateItems = [...(state.usersList.items || [])];
        const index = stateItems.findIndex((us) => us === userSub._id);

        if (index !== -1) {
          stateItems.splice(index, 1);
          stateItems.unshift(userSub._id || '');
        }
      } else {
        if (!!item?._id) {
          state.usersList.items.unshift(item._id!);
          state.userObjectList.items[item?._id || ''] = item;
          state.alreadyFetchedUsers.items[item?._id || ''] = item;
          state.alreadyFetchedUsers.totalCount =
            (state.alreadyFetchedUsers.totalCount || 0) + 1;
        }
      }
    });

    builder.addCase(getPeopleYoumayknow.fulfilled, (state, action) => {
      // Add user to the state array
      state.youmayknowusers = action.payload.data;
      state.isYoumayknowFetching = false;
    });
    builder.addCase(getPeopleYoumayknow.pending, (state, action) => {
      // Add user to the state array
      state.isYoumayknowFetching = true;
    });
    builder.addCase(getPeopleYoumayknow.rejected, (state, action) => {
      // Add user to the state array
      state.isYoumayknowFetching = false;
    });
  },
});
const SelectUserObjectList = (state: RootState) => state.mysales.userObjectList;
// Extract the action creators object and the reducer
export const selectUserObjectList = createSelector(
  [SelectUserObjectList],
  (obj) => {
    return obj as MySalesState['userObjectList'];
  },
);
const { actions, reducer } = MySalesSlice;

export const {
  setSelectedOrder,
  // setSelectedUser,
  addPendingMessage,
  removeFromPendingMessage,
  removeMediaFromPendingMessage,
  reInitializeState,
  updatePendingMessage,
  searchUserList,
  setUserOrders,
  updateUserOrders,
  resetUsers,
  updateUserOrdersByStatus,
  updateChatWindowActiveStatus,
  setSelectedSub,
  resetSubId,
  updateUsersUnreadCount,
  resetUnreadCount,
  toggleSendMessage,
  addUserLastMessage,
  updateUserLastMessage,
  insertBeginningOfUserList,
  setUserUnreadCount,
  toggleContentAccess,
  setUserListOrders,
  setIsUsersFetched,
  appendTagInSub,
  updateOnlineStatus: updateChatUserOnlineStatus,
  setUserMemberships,
  addEditPendingMessage,
  setUlockPostId,
  setUpgradePostId,
  filterPeopYoumayKnow,
  setPeopleYoumayknow,
  // checkAndInsertAtBeginning,
  increamentTotalCount,
} = actions;

export default reducer;
