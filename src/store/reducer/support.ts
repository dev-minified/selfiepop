//// Example

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSupportTicketsCount } from 'api/Support';
import { IFileGroup } from './files';
// Define a type for the slice state
interface SupportState {
  pendingMessages: {
    data: Record<string, any>;
    status: MEDIA_GROUP_UPLOAD_STATUS;
    groupId: string;
    files: IFileGroup['files'][number][];
    isSent?: boolean;
  }[];
  totalTicketsComments?: number;
}
// Define the initial state using that type
const initialState: SupportState = {
  pendingMessages: [],
  totalTicketsComments: 0,
};
export const getSupportTicketCount = createAsyncThunk(
  'support/getSupportTicketCount',
  async () => {
    const response = await getSupportTicketsCount();
    return { data: response };
  },
);

export const SupportSlice = createSlice({
  name: 'support',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addPendingMessage: (state, action) => {
      state.pendingMessages.push(action.payload);
    },
    removeMediaFromPendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages?.filter((message) => ({
        ...message,
        ...action.payload,
        files: message?.files.filter((m) => m.id !== action.payload.id),
      }));
    },
    removeFromPendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages?.filter((message) => {
        return message.groupId !== action.payload?.groupId;
      });
    },
    updatePendingMessage: (state, action) => {
      state.pendingMessages = state.pendingMessages?.map((message) =>
        message.groupId === action.payload.groupId
          ? { ...message, ...action.payload }
          : message,
      );
    },
    setSupportChatCount: (state, action) => {
      state.totalTicketsComments = action.payload.totalComments;
    },
    updateSupportChatCount: (state, action) => {
      state.totalTicketsComments = state.totalTicketsComments
        ? state.totalTicketsComments - action.payload.comments
        : action.payload.comments;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getSupportTicketCount.fulfilled, (state, action) => {
      // Add user to the state array
      // state.value = 10;
      state.totalTicketsComments = action.payload.data?.totalCount;
    });
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = SupportSlice;

export const {
  addPendingMessage,
  removeFromPendingMessage,
  updatePendingMessage,
  updateSupportChatCount,
  setSupportChatCount,
} = actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.support;

export default reducer;
