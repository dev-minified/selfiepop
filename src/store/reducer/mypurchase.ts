//// Example
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCommentReplies } from 'api/sales';

import type { RootState } from '../store';
// Define a type for the slice state
interface ISalesState {
  selectedUser?: IOrderUserType | null;
  isUserListFetching?: boolean;
  isUserOrdersFetching?: boolean;
  usersList: { items: IOrderUserType[]; totalCount: number };
  ordersList?: {
    orders: { items: IOrderType[]; totalCount: number };
    pops: { items: IOrderType[]; totalCount: number };
  };
  userposts: {
    items: IPost[];
    totalCount: number;
  };
  selectedOrder?: IOrderType;
  isUserPostsFetching?: boolean;

  isOrderFetching?: boolean;
}

// Define the initial state using that type
const initialState: ISalesState = {
  selectedUser: null,
  usersList: { items: [], totalCount: 0 },
  ordersList: {
    orders: { items: [], totalCount: 0 },
    pops: { items: [], totalCount: 0 },
  },
  userposts: {
    items: [],
    totalCount: 0,
  },
  selectedOrder: {},
  isUserListFetching: true,
  isUserPostsFetching: false,
  isUserOrdersFetching: true,
  isOrderFetching: true,
};
// export const getSelectedUserOrders = createAsyncThunk<
//   {
//     data: ISalesState['ordersList'];

//     params?: Record<string, any>;
//   },
//   {
//     userId?: string;
//     callback?: (...args: any) => void;
//     params?: Record<string, any>;
//   }
// >('purchase/getUsersOrders', async ({ userId, callback, params }) => {
//   const response = await getUserOrders(userId || '', params);
//   callback?.(response);
//   return { data: response };
// });
// export const getSelectedOrder = createAsyncThunk<
//   {
//     data: ISalesState['selectedOrder'];
//   },
//   {
//     orderId?: string;
//     callback?: (...args: any) => void;
//   }
// >('purchase/getOrder', async ({ orderId, callback }) => {
//   const response = await getOrder(orderId || '');
//   callback?.(response);
//   return { data: response };
// });
// export const getSubscriptionList = createAsyncThunk<
//   {
//     data: ISalesState['subscriptions'];
//     defaultSubscription?: string;
//     params?: Record<string, any>;
//   },
//   { defaultSubscription?: string; params?: Record<string, any> }
// >('chat/getSubsList', async ({ defaultSubscription, params }) => {
//   const data = await getSubsListApi(params);
//   return { data, defaultSubscription };
// });
// export const getUsersList = createAsyncThunk<
//   {
//     data: ISalesState['usersList'];
//     defaultOrder?: string;
//     params?: Record<string, any>;
//   },
//   { defaultOrder?: string; params?: Record<string, any> }
// >('purchase/getOrdersList', async ({ defaultOrder, params }) => {
//   const data = await getOrdersList(params);
//   return { data, defaultOrder };
// });
// export const getUserPostComments = createAsyncThunk<
//   {
//     data: IPostCommentType;
//     params?: Record<string, any>;
//     _id: string;
//     isInitial: boolean;
//   },
//   {
//     id: string;
//     params?: Record<string, any>;
//     callback?: (...args: any) => void;
//   }
// >('purchase/getUserPostComments', async ({ id, params, callback }) => {
//   const data = await getPstComments(id, params);
//   callback?.(data);
//   // return { data: postsData, isInitial: !params?.skip };
//   return { data, _id: id, isInitial: !params?.skip };
// });
export const getUserPostCommentReplies = createAsyncThunk<
  {
    data: IPostCommentType;
    params?: Record<string, any>;
    _id: string;
    postId: string;
    isInitial: boolean;
  },
  {
    id: string;
    postId: string;
    params?: Record<string, any>;
    callback?: (...args: any) => void;
  }
>(
  'purchase/getUserPostCommentReplies',
  async ({ id, postId, params, callback }) => {
    const data = await getCommentReplies(id, params);
    callback?.(data);
    // return { data: postsData, isInitial: !params?.skip };
    return { data, _id: id, postId, isInitial: !params?.skip };
  },
);

// export const toggleUserCommentLike = createAsyncThunk<
//   {
//     _id: string;
//     postId?: string;
//     data: { message: string; success: boolean };
//   },
//   { id: string; postId?: string; callback?: (...args: any) => void }
// >('purchase/postcommenttoggle', async ({ id, postId, callback }) => {
//   const data = await toggleCommntLike(id);
//   callback?.(data);
//   return { data, _id: id, postId };
// });
// export const getUserMembershops = createAsyncThunk<
//   {
//     data: IPostCommentType;
//     params?: Record<string, any>;
//     _id: string;
//     isInitial: boolean;
//   },
//   {
//     id: string;
//     params?: Record<string, any>;
//     callback?: (...args: any) => void;
//   }
// >('purchase/userpostmemberships', async ({ id, params, callback }) => {
//   const data = await getMemberShipsByUserId(id, params || {});
//   callback?.(data);
//   // return { data: postsData, isInitial: !params?.skip };
//   return { data, _id: id, isInitial: !params?.skip };
// });
export const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      if (action.payload === null) {
        state.selectedUser = undefined;
      } else {
        state.selectedUser = { ...action.payload, unread: 0 };
        state.usersList.items = state.usersList.items.map((item) =>
          item._id === action.payload._id ? { ...item, unread: 0 } : item,
        );
      }
    },
    updateUsersList: (state, action) => {
      const index = state.usersList.items.findIndex(
        (item) => item._id === action.payload.subscriptionId,
      );
      if (index > -1) {
        state.usersList.items[index] = {
          ...state.usersList.items[index],
          ...action.payload.subscription,
        };
      }
    },

    // addSubscriptionSubsList: (state, action) => {
    //   state.ordersList!.items.push(action.payload);
    //   state.ordersList!.totalCount++;
    // },
    // updateAssociatedSubInSubList: (state, action) => {
    //   const index = state.ordersList?.items.findIndex(
    //     (item) => action.payload._id === item._id,
    //   );
    //   if (index !== -1) {
    //     state.ordersList!.items[index as number] = action.payload;
    //   }
    // },
    resetUsers: (state, action) => {
      state.usersList = { items: [], totalCount: 0 };
      state.selectedUser = undefined;
    },
    setUserOrders: (state, action) => {
      state.ordersList = action.payload || {
        orders: { items: [], totalCount: 0 },
        pops: { items: [], totalCount: 0 },
      };
    },
    updateUserlikes: (state, action) => {
      const index = state?.userposts?.items.findIndex(
        (item) => item?._id === action?.payload?.postId,
      );
      state.userposts.items[index].postLikes = action?.payload?.postLikes;
    },
    addUserComment: (state, action) => {
      const index = state?.userposts?.items.findIndex(
        (item) => item?._id === action?.payload?.comment?.postId,
      );
      if (index > -1) {
        state.userposts.items[index].comments!.items!.unshift({
          likeCount: 0,
          childCount: 0,
          commentLiked: false,
          ...action?.payload?.comment,
        });
        state.userposts.items[index].comments!.totalCount!++;
      }
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload || {};
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(getUsersList.pending, (state, action) => {
    //   state.isUserListFetching = true;
    // });
    // builder.addCase(getUsersList.rejected, (state, action) => {
    //   state.isUserListFetching = false;
    // });
    builder.addCase(getUserPostCommentReplies.fulfilled, (state, action) => {
      const index = state.userposts.items.findIndex(
        (p) => p._id === action.payload?.postId,
      );
      if (index > -1) {
        const nestedComment = state.userposts.items[
          index
        ].comments!.items!.findIndex((n) => n._id === action.payload?._id);
        if (nestedComment > -1) {
          let childComments = {
            ...(state.userposts.items[index].comments!.items![nestedComment]
              .childComments || {}),
          };

          if (action.payload.isInitial) {
            childComments = action.payload.data;
            state.userposts.items[index].comments!.items![
              nestedComment
            ].childComments = childComments as IPostCommentType;
          } else {
            childComments.items = [
              ...(childComments.items || []),
              ...action.payload.data.items,
            ];
            state.userposts.items[index].comments!.items![
              nestedComment
            ].childComments = childComments as IPostCommentType;
          }
        }
      }
    });
    // builder.addCase(getUsersList.fulfilled, (state, action) => {
    //   // Add user to the state array
    //   console.log(action.payload.data);
    //   state.usersList = action.payload.data;
    //   if (action.payload.data?.totalCount) {
    //     if (action.payload.defaultOrder) {
    //       const order =
    //         state.usersList.items.find(
    //           (sub) => sub._id === action.payload.defaultOrder,
    //         ) || state.usersList.items[0];
    //       // order.unread = 0;
    //       state.selectedUser = order;
    //     } else {
    //       const order = state.usersList.items[0];
    //       // order.unread = 0;
    //       state.selectedUser = order;
    //     }
    //   }
    //   state.isUserListFetching = false;
    // });

    // // getUser Orders
    // builder.addCase(getSelectedUserOrders.pending, (state, action) => {
    //   state.isUserOrdersFetching = true;
    // });
    // builder.addCase(getSelectedUserOrders.rejected, (state, action) => {
    //   state.isUserOrdersFetching = false;
    // });
    // builder.addCase(getSelectedUserOrders.fulfilled, (state, action) => {
    //   // Add user to the state array
    //   state.ordersList = action.payload.data;
    //   state.isUserOrdersFetching = false;
    // });

    // // getUser Orders
    // builder.addCase(getSelectedOrder.pending, (state, action) => {
    //   state.isOrderFetching = true;
    // });
    // builder.addCase(getSelectedOrder.rejected, (state, action) => {
    //   state.isOrderFetching = false;
    // });
    // builder.addCase(getSelectedOrder.fulfilled, (state, action) => {
    //   // Add user to the state array
    //   state.selectedOrder = action.payload.data;
    //   state.isOrderFetching = false;
    // });
    // builder.addCase(getUserPostComments.fulfilled, (state, action) => {
    //   const index = state.userposts.items.findIndex(
    //     (p) => p._id === action.payload?._id,
    //   );
    //   if (index > -1) {
    //     if (action.payload.isInitial) {
    //       state.userposts.items[index].comments = action.payload.data;
    //     } else {
    //       state.userposts.items[index].comments!.items = [
    //         ...(state.userposts.items[index].comments?.items || []),
    //         ...action.payload.data.items,
    //       ];
    //     }
    //   }
    //   // state.isPostDeleting = false;
    // });
    // * toggle Comemnt Like
    // builder.addCase(toggleUserCommentLike.fulfilled, (state, action) => {
    //   const index = state.userposts.items.findIndex(
    //     (p) => p._id === action.payload?.postId,
    //   );
    //   if (index > -1) {
    //     const commentIndex = state.userposts.items[
    //       index
    //     ].comments!.items.findIndex((cm) => cm._id === action.payload?._id);
    //     if (commentIndex > -1) {
    //       let comment =
    //         state.userposts.items[index].comments!.items[commentIndex];
    //       if (comment.commentLiked) {
    //         comment = {
    //           ...comment,
    //           commentLiked: false,
    //           likeCount: comment.likeCount! - 1,
    //         };
    //       } else {
    //         comment = {
    //           ...comment,
    //           commentLiked: true,
    //           likeCount: comment.likeCount! + 1,
    //         };
    //       }
    //       state.userposts.items[index].comments!.items[commentIndex] = comment;
    //     }
    //   }
    //   // state.isPostDeleting = false;
    // });
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = purchaseSlice;

export const {
  setSelectedUser,
  setUserOrders,
  updateUsersList,
  setSelectedOrder,
  addUserComment,
  updateUserlikes,
  resetUsers,
} = actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;

export default reducer;
