import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deletePost as postDelete, GetMyScheduledPost } from 'api/sales';
import * as api from 'api/schedule-messaging';
import { publishNow } from 'api/schedule-post';
import dayjs, { Dayjs } from 'dayjs';
import { WritableDraft } from 'immer/dist/internal';

import { parseQuery } from 'util/index';

interface IScheduledMessagingState {
  selectedDate: Dayjs;
  messages: ChatMessage[];
  selectedView?: ScheduledMessagingViews;
  filteredMessages: ChatMessage[];
  price: number;
  message: string;
  selectedTime: string;
  selectedMessage: ChatMessage | null;
  media: MediaType[];
  messageActionsRules: {
    tagsToAdd?: Pick<ChatMessage, 'tagsToAdd'>;
    tagsToRemove?: Pick<ChatMessage, 'tagsToRemove'>;
    excludedMedia?: MediaType[] | string[];
    excludedTags?: Pick<ChatMessage, 'excludedTags'>;
    includedTags?: Pick<ChatMessage, 'includedTags'>;
    listToAdd?: Pick<ChatMessage, 'listToAdd'>;
    listToRemove?: Pick<ChatMessage, 'listToRemove'>;
  };
  scheduleData?: {
    messages?: Record<string, Record<string, any[]>>;
    posts?: Record<string, Record<string, any[]>>;
  };
  isSchedulePostsFetching?: boolean;
  selectedScheduledPost?: any;
  filteredSchdulePost?: { totalCount?: number; items?: ChatMessage[] };

  filteredSchduleMessages?: { totalCount?: number; items?: ChatMessage[] };
  isScheduleMessagesFetching?: boolean;
  isSchedulePostDeleting?: boolean;
  isDataFetched?: boolean;
}

const initialState: IScheduledMessagingState = {
  selectedDate: dayjs(),
  selectedView: parseQuery(window.location.search)
    ?.view as ScheduledMessagingViews,
  messages: [],
  filteredMessages: [],
  price: 5,
  filteredSchdulePost: {
    totalCount: 0,
    items: [],
  },
  filteredSchduleMessages: {
    totalCount: 0,
    items: [],
  },
  isSchedulePostDeleting: false,
  isSchedulePostsFetching: false,
  isScheduleMessagesFetching: false,
  message: '',
  selectedTime: '',
  selectedMessage: null,
  media: [],
  messageActionsRules: {},
  scheduleData: {
    messages: {},
    posts: {},
  },
  selectedScheduledPost: {},
  isDataFetched: false,
};

export const deletePost = createAsyncThunk<
  IPost,
  IPost & { sellerId?: string }
>('sale/deletePost', async ({ _id, ...rest }) => {
  await postDelete(_id || '', { sellerId: rest.sellerId });
  return { ...rest, _id };
});

export const mySchedulePostsList = createAsyncThunk<
  {
    data: any;
  },
  {
    params?: Record<string, any>;
    customError?: { ignoreStatusCodes: [number] };
  }
>('sale/mySchedulePostsList', async ({ params, customError }) => {
  const res = await GetMyScheduledPost(params, customError);
  return { data: res?.items };
});
export const getMessages = createAsyncThunk<
  { messages: ChatMessage[] },
  {
    date?: string;
    startDate?: string;
    endDate?: string;
    sellerId?: string;
  }
>(
  'scheduledMessaging/getMessages',
  async ({ date, startDate, endDate, sellerId }) => {
    const res = await api.getMessages({ date, startDate, endDate, sellerId });
    return { messages: res?.items || [] };
  },
);

export const deleteMessage = createAsyncThunk<
  ChatMessage,
  ChatMessage & { sellerId?: string }
>('scheduledMessaging/deleteMessage', async ({ _id, ...rest }) => {
  await api.deleteMessage(_id || '', { sellerId: rest.sellerId });
  return { _id, ...rest };
});
export const publishPost = createAsyncThunk<
  IPost,
  IPost & { sellerId?: string }
>('scheduledPost/publish', async ({ _id, ...rest }) => {
  await publishNow(_id || '', { sellerId: rest.sellerId });
  return { _id, ...rest };
});
export const publish = createAsyncThunk<
  ChatMessage,
  ChatMessage & { sellerId?: string }
>('scheduledMessaging/publish', async ({ _id, ...rest }) => {
  await api.publishNow(_id || '', { sellerId: rest.sellerId });
  return { _id, ...rest };
});

export const getMediaList = createAsyncThunk<
  MediaType[],
  { sellerId?: string } | undefined
>('scheduledMessaging/media', async (data) => {
  const res = await api.getMediaList(data?.sellerId);
  return res.data;
});

export const updateMessage = createAsyncThunk<
  ChatMessage,
  { id: string; data: Partial<ChatMessage> & { sellerId?: string } }
>('scheduledMessaging/update', async ({ id, data }) => {
  const res = await api.updateMessage(id, data);
  return res;
});

const updateFilteredMessagesState = (
  state: WritableDraft<IScheduledMessagingState>,
) => {
  state.filteredMessages = state.messages.filter((message) =>
    dayjs(message.publishDateTime).isSame(state.selectedDate, 'date'),
  );
};
const updateScheduleData = (
  state: IScheduledMessagingState,
  key: 'messages' | 'posts',
  data: any[] = [],
) => {
  let newData = { ...state.scheduleData?.[key] };
  data.forEach((m: any) => {
    const date = dayjs(m.publishDateTime || m.publishAt);

    const month = date.month();
    const year = date.year();
    const day = date.date();
    if (newData[`${year}-${month}`]) {
      newData = {
        ...(newData || {}),
        [`${year}-${month}`]: {
          ...(newData[`${year}-${month}`] || {}),
          [day]: [...(newData[`${year}-${month}`][day] || []), m],
        },
      };
    } else {
      newData = {
        ...(newData || {}),
        [`${year}-${month}`]: {
          [day]: [m],
        },
      };
    }
  });

  state.scheduleData = {
    ...state.scheduleData,
    [key]: { ...(newData || {}) },
  };
};
const updateFilteredMessagesPostsState = (
  state: WritableDraft<IScheduledMessagingState>,
  key: 'posts' | 'messages',
  StateKey: 'filteredSchduleMessages' | 'filteredSchdulePost',
  date?: string | Dayjs,
) => {
  const selectedDat =
    state.selectedDate || date ? dayjs(date || state.selectedDate) : null;
  let dayData = [];
  if (selectedDat) {
    const month = selectedDat.month();
    const year = selectedDat.year();
    const day = selectedDat.date();
    const yearData = state?.scheduleData?.[key];
    if (yearData && yearData?.[`${year}-${month}`]) {
      dayData = yearData?.[`${year}-${month}`][day] || [];

      state[StateKey] = { items: dayData, totalCount: dayData?.length };
    } else {
      state[StateKey] = { items: [], totalCount: 0 };
    }
  }
  return dayData;
};
const currentDayPostsAndMessages = (
  state: WritableDraft<IScheduledMessagingState>,
  date: string | Dayjs,
) => {
  updateFilteredMessagesPostsState(
    state,
    'messages',
    'filteredSchduleMessages',
    date,
  );
  updateFilteredMessagesPostsState(state, 'posts', 'filteredSchdulePost', date);
};
const insertPostAttheEnd = (
  state: IScheduledMessagingState,
  key: 'messages' | 'posts',
  record?: Record<string, any>,
) => {
  let newData = { ...state.scheduleData?.[key] };
  let dayData: any[] = [];
  const recordDate =
    record?.publishDateTime || record?.publishAt
      ? dayjs(record?.publishDateTime || record?.publishAt)
      : null;
  if (recordDate && newData) {
    const month = recordDate.month();
    const year = recordDate.year();
    const day = recordDate.date();
    let keyRecords = newData?.[`${year}-${month}`];
    if (keyRecords) {
      dayData = [...(keyRecords?.[day] || []), record];
      keyRecords[day] = dayData;
      newData[`${year}-${month}`] = keyRecords;
    } else {
      newData = {
        ...(newData || {}),
        [`${year}-${month}`]: {
          [day]: [record],
        },
      };
    }
    state.scheduleData![key] = newData;
  }
  if (key === 'messages') {
    state.filteredSchduleMessages = {
      items: dayData,
      totalCount: dayData?.length || 0,
    };
  }
  if (key === 'posts') {
    state.filteredSchdulePost = {
      items: dayData,
      totalCount: dayData?.length || 0,
    };
  }
  return dayData;
};

const removeScheduleDataItem = (
  state: IScheduledMessagingState,
  key: 'messages' | 'posts',
  record?: Record<string, any>,
) => {
  let newData = { ...state.scheduleData?.[key] };
  let dayData = [];
  const recordDate =
    record?.publishDateTime || record?.publishAt
      ? dayjs(record?.publishDateTime || record?.publishAt)
      : null;
  if (recordDate && newData) {
    const month = recordDate.month();
    const year = recordDate.year();
    const day = recordDate.date();
    let keyRecords = newData?.[`${year}-${month}`];
    if (keyRecords && keyRecords?.[day]) {
      dayData = keyRecords?.[day] || [];
      const index = dayData.findIndex((item) => item?._id === record?._id);
      if (index !== -1) {
        dayData.splice(index, 1);
        if (dayData?.length) {
          keyRecords[day] = dayData;
          newData[`${year}-${month}`] = keyRecords;

          if (key === 'messages') {
            state.filteredSchduleMessages = {
              items: keyRecords[day],
              totalCount: keyRecords[day]?.length || 0,
            };
          }
          if (key === 'posts') {
            state.filteredSchdulePost = {
              items: keyRecords[day],
              totalCount: keyRecords[day]?.length || 0,
            };
          }
        } else {
          delete keyRecords?.[day];
          newData[`${year}-${month}`] = keyRecords;

          if (key === 'messages') {
            state.filteredSchduleMessages = {
              items: [],
              totalCount: 0,
            };
          }
          if (key === 'posts') {
            state.filteredSchdulePost = {
              items: [],
              totalCount: 0,
            };
          }
        }
        state.scheduleData![key] = newData;
      }
    }
  }
  return dayData;
};
const updateScheduleDataItem = (
  state: IScheduledMessagingState,
  key: 'messages' | 'posts',
  record?: Record<string, any>,
) => {
  let newData = { ...state?.scheduleData?.[key] };
  let dayData = [];
  const recordDate =
    record?.publishDateTime || record?.publishAt
      ? dayjs(record?.publishDateTime || record?.publishAt)
      : null;

  if (recordDate && newData) {
    const month = recordDate.month();
    const year = recordDate.year();
    const day = recordDate.date();
    let keyRecords = newData?.[`${year}-${month}`];
    if (keyRecords && keyRecords?.[day]) {
      dayData = keyRecords?.[day] || [];
      const index = dayData.findIndex((item) => item?._id === record?._id);
      if (index !== -1) {
        dayData[index] = { ...dayData[index], ...record };
        keyRecords[day] = dayData;
        newData[`${year}-${month}`] = keyRecords;
        state.scheduleData![key] = newData;
        if (state?.selectedDate.isSame(recordDate, 'date')) {
          if (key === 'messages') {
            state.filteredSchduleMessages = {
              items: keyRecords[day],
              totalCount: keyRecords[day]?.length || 0,
            };
          }
          if (key === 'posts') {
            state.filteredSchdulePost = {
              items: keyRecords[day],
              totalCount: keyRecords[day]?.length || 0,
            };
          }
        }
      }
    }
  }
  return dayData;
};
export const chatSliderSlice = createSlice({
  name: 'scheduledMessaging',
  initialState,
  reducers: {
    reInitializeScheduleState: (state) => {
      state.selectedDate = dayjs();
      state.selectedView = parseQuery(window.location.search)
        .view as ScheduledMessagingViews;
      state.messages = [];
      state.filteredMessages = [];
      state.price = 5;
      state.isSchedulePostsFetching = false;
      state.isScheduleMessagesFetching = false;
      state.message = '';
      state.selectedTime = '';
      state.selectedMessage = null;
      state.media = [];
      state.messageActionsRules = {};
      state.selectedScheduledPost = {};
      state.filteredSchduleMessages = { items: [], totalCount: 0 };
      state.filteredSchdulePost = { items: [], totalCount: 0 };
      state.scheduleData = {
        messages: {},
        posts: {},
      };
    },
    setSelectedDate: (
      state,
      action: PayloadAction<IScheduledMessagingState['selectedDate']>,
    ) => {
      state.selectedDate = action.payload;
    },
    setDataFetched: (
      state,
      action: PayloadAction<IScheduledMessagingState['isDataFetched']>,
    ) => {
      state.isDataFetched = action.payload;
    },
    getCurrentDayPostsMessages: (state) => {
      currentDayPostsAndMessages(state, state.selectedDate);
    },
    resetCurrentDatepostsMessages: (state) => {
      state.filteredSchduleMessages = {
        items: [],
        totalCount: 0,
      };
      state.filteredSchdulePost = {
        items: [],
        totalCount: 0,
      };
    },
    resetCurrentPostsMessages: (state) => {
      state.scheduleData = {
        messages: {},
        posts: {},
      };
    },
    setSelectedView: (
      state,
      action: PayloadAction<IScheduledMessagingState['selectedView']>,
    ) => {
      state.selectedView = action.payload;
    },
    updateFilteredMessages: (state) => {
      updateFilteredMessagesState(state);
    },
    updateSchedulePost: (state, action) => {
      updateScheduleDataItem(state, 'posts', {
        _id: action.payload?._id,
        ...action.payload,
      });
    },
    addMessage: (
      state,
      action: PayloadAction<IScheduledMessagingState['messages'][number]>,
    ) => {
      // state.messages.push(action.payload);

      insertPostAttheEnd(state, 'messages', action.payload);
    },
    setPrice: (
      state,
      action: PayloadAction<IScheduledMessagingState['price']>,
    ) => {
      state.price = action.payload;
    },
    setMessage: (
      state,
      action: PayloadAction<IScheduledMessagingState['message']>,
    ) => {
      state.message = action.payload;
    },
    setSelectedTime: (
      state,
      action: PayloadAction<IScheduledMessagingState['selectedTime']>,
    ) => {
      state.selectedTime = action.payload;
    },
    updatePublishMessage: (state, action) => {
      updateScheduleDataItem(state, 'messages', {
        _id: action.payload._id,
        ...action.payload,
        status: 'SENT',
      });
    },
    setSelectedMessage: (
      state,
      action: PayloadAction<IScheduledMessagingState['selectedMessage']>,
    ) => {
      state.selectedMessage = action.payload;
    },
    updatescheduleMessage: (
      state,
      action: PayloadAction<IScheduledMessagingState['messageActionsRules']>,
    ) => {
      state.messageActionsRules = action.payload;
    },
    setSelectedScheduledPost: (state, action) => {
      state.selectedScheduledPost = action.payload;
    },
    insertpostAttheEnd: (state, action) => {
      insertPostAttheEnd(state, 'posts', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getMessages.fulfilled,
      (
        state,
        action: PayloadAction<{
          messages: IScheduledMessagingState['messages'];
        }>,
      ) => {
        updateScheduleData(state, 'messages', action.payload.messages);
      },
    );
    builder.addCase(mySchedulePostsList.fulfilled, (state, action) => {
      updateScheduleData(state, 'posts', action.payload.data);
      state.isSchedulePostsFetching = false;
    });
    builder.addCase(mySchedulePostsList.pending, (state, action) => {
      state.isSchedulePostsFetching = true;
    });
    builder.addCase(mySchedulePostsList.rejected, (state, action) => {
      state.isSchedulePostsFetching = false;
    });
    builder.addCase(
      deleteMessage.fulfilled,
      (state, action: PayloadAction<ChatMessage>) => {
        removeScheduleDataItem(state, 'messages', action.payload);
      },
    );

    builder.addCase(
      getMediaList.fulfilled,
      (state, action: PayloadAction<MediaType[]>) => {
        state.media = action.payload;
      },
    );

    builder.addCase(
      publish.fulfilled,
      (state, action: PayloadAction<ChatMessage>) => {
        updateScheduleDataItem(state, 'messages', {
          _id: action.payload._id,
          ...action.payload,
          status: 'SENT',
        });
      },
    );
    builder.addCase(
      publishPost.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        updateScheduleDataItem(state, 'posts', {
          ...action.payload,
          status: 'published',
        });
      },
    );

    builder.addCase(
      updateMessage.fulfilled,
      (state, action: PayloadAction<ChatMessage>) => {
        updateScheduleDataItem(state, 'messages', {
          _id: action.payload._id,
          ...action.payload,
        });
      },
    );
    builder.addCase(deletePost.fulfilled, (state, action) => {
      removeScheduleDataItem(state, 'posts', action.payload);

      state.isSchedulePostDeleting = false;
    });
    builder.addCase(deletePost.pending, (state, action) => {
      state.isSchedulePostDeleting = true;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.isSchedulePostDeleting = false;
    });
  },
});

const { actions, reducer } = chatSliderSlice;

export const {
  setSelectedDate,
  setSelectedView,
  updateFilteredMessages,
  setPrice,
  setMessage,
  setSelectedTime,
  updatePublishMessage,
  addMessage,
  setSelectedMessage,
  updatescheduleMessage,
  reInitializeScheduleState,
  getCurrentDayPostsMessages,
  resetCurrentDatepostsMessages,
  resetCurrentPostsMessages,
  setSelectedScheduledPost,
  updateSchedulePost,
  insertpostAttheEnd,
  setDataFetched,
} = actions;

export default reducer;
