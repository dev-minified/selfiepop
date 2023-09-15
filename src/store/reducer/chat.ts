//// Example
import { createAsyncThunk, createSlice, Draft } from '@reduxjs/toolkit';
import {
  addEmoji as addEmojiApi,
  cancelAutoReniew,
  chatUnsubscribe,
  getAllMedia as getAllMediaApi,
  getLogHistory as getLogHistoryApi,
  getMessages as getMessagesApi,
  getSubscriptionsList as getSubsListApi,
  getSubScriptionsSubList,
  sendChatMessage,
  sendMedia as sendMediaApi,
} from 'api/ChatSubscriptions';
import { getSubscriptionById } from 'api/sales';
import { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';

import { createPendingMessage, getLocalStorage } from 'util/index';
import type { AppDispatch, RootState } from '../store';
import { IFileGroup } from './files';
// Define a type for the slice state
interface IChatState {
  selectedSubscription?: ChatSubsType | null;
  subscriptions: { items: ChatSubsType[]; totalCount: number };
  subscriptionsSubList?: { items: SubscriptionSubList[]; totalCount: number };
  media: { items: ChatMessage['messageMedia']; hasMore: boolean };
  messages: {
    items: ChatMessage[];
    totalCount: number;
    hasMore?: boolean;
  };
  templateMessage?: ChatMessage | null;
  pendingMessages: (ChatMessage & {
    messageMedia: (ChatMessage['messageMedia'][number] &
      IFileGroup['files'][number])[];
    isSent?: boolean;
  })[];
  isSendingMessage: boolean;
  message?: string;
  price?: number;
  isGalleryLoading?: boolean;
  isSubscriptionSubListLoading?: boolean;
  isFetchingMessages?: boolean;
  isFetchingSubscription?: boolean;
  purchaseWallet?: any;
  messageFiles?: ChatMessage['messageMedia'];
  logHistory?: SubscriptionLog[];
}

// Define the initial state using that type
const initialState: IChatState = {
  templateMessage: null,
  selectedSubscription: null,
  subscriptions: { items: [], totalCount: 0 },
  subscriptionsSubList: { items: [], totalCount: 0 },
  media: { items: [], hasMore: false },
  messageFiles: [],
  isGalleryLoading: false,
  pendingMessages: [],
  messages: { items: [], totalCount: 0, hasMore: false },
  isSendingMessage: false,
  isSubscriptionSubListLoading: false,
  isFetchingMessages: false,
  message: '',
  price: 5,
  isFetchingSubscription: false,
  logHistory: [],
};
export const getAllSubsCriptionSubList = createAsyncThunk<
  {
    items: SubscriptionSubList[];
    totalCount: number;
  },
  { query?: Record<string, any> } | undefined
>('chat/getAllSubscriptionSublist', async ({ query = {} } = {}) => {
  const response = await getSubScriptionsSubList(query);
  return response;
});
export const getSubscriptionList = createAsyncThunk<
  {
    data: IChatState['subscriptions'];
    defaultSubscription?: string;
    params?: Record<string, any>;
  },
  {
    defaultSubscription?: string;
    params?: Record<string, any>;
    callback?: (...args: any) => void;
  }
>('chat/getSubsList', async ({ defaultSubscription, params, callback }) => {
  const data = await getSubsListApi(params);
  callback?.(data);
  return { data, defaultSubscription };
});
const updateSubscriptions = (state: IChatState, action: any) => {
  const index = state.subscriptions.items.findIndex(
    (sub) => sub._id === action.payload._id,
  );
  if (index !== -1) {
    // state.selectedSubscription = action.payload;
    state.subscriptions.items[index] = action.payload;
  }

  if (state.selectedSubscription?._id === action.payload._id) {
    state.selectedSubscription = action.payload;
  }
};

export const getAllMedia = createAsyncThunk<
  { items: ChatMessage['messageMedia']; totalCount: number; hasMore: boolean },
  { id: string; options?: AxiosRequestConfig }
>('chat/getAllMedia', async ({ id, options }) => {
  const response = await getAllMediaApi(id, options || {});
  return response;
});

export const getMessages = createAsyncThunk<
  IChatState['messages'],
  {
    subscriptionId: string;
    callback?: (...args: any) => void;
    options?: AxiosRequestConfig;
    handleError?: boolean;
  }
>(
  'chat/getMessages',
  async ({ subscriptionId, callback, options, handleError }) => {
    const response = await getMessagesApi(subscriptionId, options, handleError);
    callback?.(response);
    return response;
  },
);

export const sendMessage = createAsyncThunk<
  ChatMessage,
  {
    subscriptionId: string;
    message: string;
    paidtype: boolean;
    id: string;
    templateId?: string;
    sellerId?: string;
    viewBy?: string;
  }
>(
  'chat/sendMessage',
  async ({
    subscriptionId,
    message,
    paidtype,
    id,
    templateId,
    sellerId,
    viewBy,
  }) => {
    const response = await sendChatMessage(subscriptionId, {
      message,
      paidtype,
      templateId,
      sellerId,
    });
    return { ...response, id };
  },
);

export const chatUnsubscribeToggler = createAsyncThunk<
  { data: ChatSubsType },
  {
    subscriptionId: string;
    data: Record<string, any>;
    callback?: (...args: any[]) => void;
    dispatch: AppDispatch;
  }
>('chat/chatsubscribeToggler', async ({ subscriptionId, data, callback }) => {
  const response = await chatUnsubscribe(subscriptionId, data);
  callback?.(response);
  return { ...response };
});
export const cancelSubAutoReniew = createAsyncThunk<
  ChatSubsType,
  {
    subscriptionId: string;
    callback?: (...args: any[]) => void;
  }
>('chat/cancelAutoReniew', async ({ subscriptionId, callback }) => {
  const response = await cancelAutoReniew(subscriptionId);
  callback?.(response);
  return { ...response };
});

export const sendMedia = createAsyncThunk<
  ChatMessage,
  {
    subscriptionId: string;
    data: {
      library: {
        type?: string;
        thumbnail?: string;
        path?: string;
        isPaidType?: boolean;
        videoDuration?: string;
        name?: string;
      }[];
      message?: string;
      blurThumnail?: string;
      price?: number;
      sellerId?: string;
      templateId?: string;
    };
  }
>('chat/sendMedia', async (data, { dispatch }) => {
  const response = await sendMediaApi(data.subscriptionId, data.data);
  response._id &&
    dispatch(
      updateLastMessage({
        message: { ...(response || {}) },
        id: response?.subscriptionId,
      }),
    );
  dispatch(removeFromPendingMessage(response));
  return response;
});

export const addEmoji = createAsyncThunk<
  {
    type: string;
    emojiId: string;
    subscriptionId: string;
    messageId: string;
    emojiType: string;
  },
  {
    subscriptionId: string;
    messageId: string;
    data: { type: string; sellerId?: string };
    emojiId?: string;
  }
>('chat/addEmoji', async ({ subscriptionId, messageId, data, emojiId }) => {
  await addEmojiApi(subscriptionId, messageId, data);
  if (emojiId) {
    return {
      type: 'remove',
      emojiId,
      subscriptionId,
      messageId,
      emojiType: data.type,
    };
  }

  return {
    type: 'add',
    subscriptionId,
    messageId,
    emojiId: '',
    emojiType: data.type,
  };
});
function updateUserOnlineStatus(
  user: Draft<ChatSubsType['buyerId']>,
  isOnline: boolean,
) {
  user.isOnline = isOnline;
  user.offlineAt = dayjs().format();
}

export const getSubscription = createAsyncThunk<
  { data: any },
  {
    subscriptionId: string;
    callback?: (...args: any) => void;
    options?: Record<string, any>;
    customError?: { ignoreStatusCodes: [number] };
  }
>(
  'chat/getSubscription',
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

export const getLogHistory = createAsyncThunk<
  any,
  { subscriptionId: string; params?: Record<string, any> }
>(`chat/logHistory`, async ({ subscriptionId, params }) => {
  const res = await getLogHistoryApi(subscriptionId, params);
  return res.Items;
});

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatState: () => {
      return initialState;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setSelectedChat: (state, action) => {
      if (action.payload == null) {
        state.selectedSubscription = undefined;
      } else {
        state.selectedSubscription = { ...action.payload, unread: 0 };
        state.subscriptions.items = state.subscriptions.items.map((item) =>
          item._id === action.payload._id ? { ...item, unread: 0 } : item,
        );
      }
    },
    setPurchaseWallet: (state, action) => {
      state.purchaseWallet = action.payload;
    },
    updateSubscriptionsList: (state, action) => {
      const index = state.subscriptions.items.findIndex(
        (item) => item._id === action.payload.subscriptionId,
      );
      if (index > -1) {
        state.subscriptions.items[index] = {
          ...state.subscriptions.items[index],
          ...action.payload.subscription,
        };
      }
    },
    updateSubscriptionUnreadCount: (state, action) => {
      const index = state?.subscriptions?.items.findIndex(
        (item) => item?._id === action?.payload?.subscriptionId,
      );
      if (index !== -1) {
        const Top = state?.subscriptions?.items[index];
        state?.subscriptions?.items?.splice(index, 1);
        state?.subscriptions?.items?.splice(0, 0, Top);
        if (index > -1) {
          state.subscriptions.items[0].unread!++;
        }
      }
    },
    setTemplateMessage: (state, action) => {
      state.templateMessage = action.payload;
    },
    removeTemplateMessage: (state) => {
      state.templateMessage = null;
    },
    updateNoticationsAndNickName: (state, action) => {
      updateSubscriptions(state as IChatState, action);
    },
    updateTags: (state, action) => {
      updateSubscriptions(state as IChatState, action);
    },
    updateNotes: (state, action) => {
      updateSubscriptions(state as IChatState, action);
    },
    setIsSendingMessage: (state, action) => {
      state.isSendingMessage = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.items.push(action.payload);
      state.messages.totalCount++;
    },
    addActiveSubMessage: (state, action) => {
      const isSubActive =
        state.selectedSubscription?._id === action.payload?.subscriptionId;
      if (isSubActive) {
        state.messages.items.push(action.payload);
        state.messages.totalCount++;
      }
    },
    addPendingMessage: (state, action) => {
      state.pendingMessages.push(action.payload);
    },
    removeFromPendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages.filter(
        (message) =>
          message.messageMedia.findIndex(
            (m) => m.path === action.payload.messageMedia[0].path,
          ) < 0,
      );
    },
    removeGiftFromPendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages.filter((message) => {
        return message._id !== action.payload?._id;
      });
    },
    updatePendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages.map((message) =>
        message._id === action.payload._id
          ? { ...message, ...action.payload }
          : message,
      );
    },
    removePendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages.filter(
        (message) => message._id !== action.payload._id,
      );
    },
    removeMessage: (state, action) => {
      state.messages.items = state.messages.items.filter(
        (message) => message._id !== action.payload,
      );
      state.messages.totalCount--;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMedia: (state, action) => {
      state.media = action.payload;
    },
    updateMessage: (state, action) => {
      state.messages.items = state.messages.items.map((message) =>
        message._id === action.payload._id
          ? { ...message, ...action.payload }
          : message,
      );
    },
    updateEmojis: (state, action) => {
      const { messageId, emojis } = action.payload;
      state.messages.items = state.messages.items.map((message) =>
        message._id === messageId ? { ...message, emojis } : message,
      );
    },
    updateOnlineStatus: (state, { payload }) => {
      const isOnline = payload.type === 'userOnline';
      const { id = '' } = payload;

      if (state.selectedSubscription?.buyerId?._id === id) {
        updateUserOnlineStatus(state.selectedSubscription!.buyerId!, isOnline);
      } else if (state.selectedSubscription?.sellerId?._id === id) {
        updateUserOnlineStatus(state.selectedSubscription!.sellerId!, isOnline);
      }

      state.subscriptions.items.forEach((sub) => {
        if (sub?.buyerId?._id === id) {
          updateUserOnlineStatus(sub!.buyerId!, isOnline);
        } else if (sub?.sellerId?._id === id) {
          updateUserOnlineStatus(sub!.sellerId!, isOnline);
        }
      });
    },
    updateLastMessage: (state, action) => {
      const index = state.subscriptions.items.findIndex(
        (item) => item._id === action.payload.id,
      );
      if (index !== -1) {
        const sub = state.subscriptions.items[index];
        sub.lastMessage = action.payload.message;
        state.subscriptions.items[index] = sub;

        state.subscriptions.items.splice(index, 1);
        state.subscriptions.items.splice(0, 0, sub);
      }
    },
    markAllAsRead: (state, action) => {
      state.messages.items = state.messages.items.map((message) => ({
        ...message,
        isRead: true,
      }));
    },
    addSubscriptionSubsList: (state, action) => {
      state.subscriptionsSubList!.items.push(action.payload);
      state.subscriptionsSubList!.totalCount++;
    },
    updateAssociatedSubInSubList: (state, action) => {
      const index = state.subscriptionsSubList?.items.findIndex(
        (item) => action.payload._id === item._id,
      );
      if (index !== -1) {
        state.subscriptionsSubList!.items[index as number] = action.payload;
      }
    },
    setMessageFiles: (state, action) => {
      state.messageFiles = action.payload;
    },
    removeMessageFiles: (state) => {
      state.messageFiles = [];
    },
    resetSubscriptions: (state, action) => {
      state.subscriptions = { items: [], totalCount: 0 };
      state.selectedSubscription = undefined;
      state.messages = { items: [], totalCount: 0, hasMore: false };
    },
    resetSubscription: (state, action) => {
      state.selectedSubscription = undefined;
      state.messages = { items: [], totalCount: 0, hasMore: false };
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getSubscriptionList.fulfilled, (state, action) => {
      // Add user to the state array
      state.subscriptions = action.payload.data;
      if (action.payload.data?.totalCount) {
        if (action.payload.defaultSubscription) {
          const subscription =
            state.subscriptions.items.find(
              (sub) => sub._id === action.payload.defaultSubscription,
            ) || state.subscriptions.items[0];
          subscription.unread = 0;
          state.selectedSubscription = subscription;
        } else {
          const subscription = state.subscriptions.items[0];
          subscription.unread = 0;
          state.selectedSubscription = subscription;
        }
      }
    });

    builder.addCase(sendMedia.fulfilled, (state, action) => {
      if (state.selectedSubscription?._id === action.payload?.subscriptionId) {
        state.messages.items.push({ ...action.payload, isSent: true });

        state.messages.totalCount++;
      }
    });

    // Get All subscription Sub lists
    builder.addCase(getAllSubsCriptionSubList.fulfilled, (state, action) => {
      if (action.payload.totalCount) {
        state.subscriptionsSubList!.items = action.payload.items;
        state.subscriptionsSubList!.totalCount = action.payload.totalCount;
      }
      state.isSubscriptionSubListLoading = false;
    });
    builder.addCase(getAllSubsCriptionSubList.pending, (state, action) => {
      state.isSubscriptionSubListLoading = true;
    });
    builder.addCase(getAllSubsCriptionSubList.rejected, (state, action) => {
      // Add user to the state array
      state.isSubscriptionSubListLoading = false;
    });

    /// Unsubscribe
    builder.addCase(chatUnsubscribeToggler.fulfilled, (state, action) => {
      // Add user to the state array
      const data = action.payload.data;
      const index = state.subscriptions?.items.findIndex(
        (item) => item._id === data?._id,
      );
      if (index !== -1) {
        const sub = state.subscriptions.items[index];
        sub.autoRenew = data.autoRenew;
        sub.isActive = data.isActive;
        sub.periodEnd = data.periodEnd;
        sub.periodStart = data.periodStart;
        state.subscriptions.items[index] = sub;
      }
      if (state.selectedSubscription?._id === data?._id) {
        state.selectedSubscription.autoRenew = data?.autoRenew;
        state.selectedSubscription.periodEnd = data.periodEnd;
        state.selectedSubscription.periodStart = data.periodStart;
        state.selectedSubscription.isActive = data.isActive;
      }
    });
    builder.addCase(cancelSubAutoReniew.fulfilled, (state, action) => {
      // Add user to the state array
      // const index = state.subscriptions?.items.findIndex(
      //   (item) => item._id === action.payload?._id,
      // );
      // if (index !== -1) {
      //   // state.subscriptions.items[index].autoRenew = action.payload.autoRenew;
      //   state.subscriptions.items[index].autoRenew = false;
      // }
      // if (state.selectedSubscription?._id === action.payload?._id) {
      //   // state.selectedSubscription = action.payload;
      //   state.selectedSubscription.autoRenew = false;
      // }
    });
    /// Media Reducer
    builder.addCase(getAllMedia.fulfilled, (state, action) => {
      // Add user to the state array
      state.media = {
        items: [...state.media.items, ...action.payload.items],
        hasMore: action.payload.hasMore,
      };
      state.isGalleryLoading = false;
    });
    builder.addCase(getAllMedia.pending, (state, action) => {
      // Add user to the state array
      state.isGalleryLoading = true;
    });
    builder.addCase(getAllMedia.rejected, (state, action) => {
      // Add user to the state array
      state.isGalleryLoading = false;
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      // Add user to the state array
      state.isFetchingMessages = false;
    });
    builder.addCase(getMessages.pending, (state, action) => {
      // Add user to the state array
      state.isFetchingMessages = true;
    });

    builder.addCase(getMessages.fulfilled, (state, action) => {
      if (!!action.payload.items?.length) {
        if (
          action.payload.items[0].subscriptionId ===
          state.selectedSubscription?._id
        ) {
          state.messages = {
            ...action.payload,
            items: [...action.payload.items.reverse(), ...state.messages.items],
          };
        }
      }

      state.isFetchingMessages = false;
    });

    builder.addCase(sendMessage.pending, (state, action) => {
      state.isSendingMessage = true;
      const message = createPendingMessage({
        _id: action.meta.arg.id,
        messageValue: action.meta.arg.message,
        isPaidType: action.meta.arg.paidtype,
        sentFrom:
          action.meta.arg.viewBy ??
          state.selectedSubscription?.sellerId._id ===
            getLocalStorage('user')?._id
            ? 'SELLER'
            : 'BUYER',
        subscriptionId: state.selectedSubscription?._id,
      });
      state.pendingMessages.push(message as any);
      const index = state?.subscriptions?.items?.findIndex(
        (item) => item?._id === state?.selectedSubscription?._id,
      );
      if (index !== -1) {
        const Top = state?.subscriptions?.items[index];
        state?.subscriptions?.items.splice(index, 1);
        state?.subscriptions?.items.splice(0, 0, Top);
      }
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.isSendingMessage = false;
      state.pendingMessages = state.pendingMessages.filter(
        (message) => message._id !== action.meta.arg.id,
      );
      state.messages.items.push({ ...action.payload, isSent: true });
      // updated last message of the subscription on message send
      if (state.selectedSubscription?._id === action.payload?.subscriptionId) {
        state.selectedSubscription.lastMessage = action.payload;
      }
      const index = state.subscriptions?.items?.findIndex(
        (sub) => sub?._id === action.payload?.subscriptionId,
      );
      if (index !== -1) {
        state.subscriptions.items[index].lastMessage = action.payload;
      }

      state.messages.totalCount++;
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.isSendingMessage = false;
    });
    builder.addCase(getSubscription.rejected, (state, action) => {
      state.isFetchingSubscription = false;
    });
    builder.addCase(getSubscription.fulfilled, (state, action) => {
      state.isFetchingSubscription = false;
      state.selectedSubscription = action.payload.data;
      const index = state?.subscriptions?.items.findIndex(
        (item) => item?._id === action?.payload?.data?._id,
      );
      if (index === -1) {
        state.subscriptions.items.push(action.payload.data);
        state.subscriptions.totalCount = !!state.subscriptions.totalCount
          ? state.subscriptions.totalCount
          : state.subscriptions.totalCount++;
        return;
      }
      state.subscriptions.items[index] = action.payload.data;
    });
    builder.addCase(getSubscription.pending, (state, action) => {
      state.isFetchingSubscription = true;
    });
    builder.addCase(getLogHistory.fulfilled, (state, action) => {
      state.logHistory =
        action.payload?.sort((a: any, b: any) =>
          dayjs(b.executionTime).diff(a.executionTime),
        ) || [];
    });
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = chatSlice;

export const {
  setSelectedChat,
  updateNotes,
  updateNoticationsAndNickName,
  updateTags,
  updateOnlineStatus,
  updateSubscriptionsList,
  updateSubscriptionUnreadCount,
  setIsSendingMessage,
  addMessage,
  addPendingMessage,
  removeMessage,
  removeFromPendingMessage,
  updateEmojis,
  updateMessage,
  updatePendingMessage,
  setMessages,
  updateLastMessage,
  setMessage,
  setPrice,
  markAllAsRead,
  addSubscriptionSubsList,
  updateAssociatedSubInSubList,
  setMedia,
  resetSubscriptions,
  removeGiftFromPendingMessage,
  addActiveSubMessage,
  resetSubscription,
  resetChatState,
  setPurchaseWallet,
  setTemplateMessage,
  removeTemplateMessage,
  setMessageFiles,
  removeMessageFiles,
  removePendingMessage,
} = actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;

export default reducer;
