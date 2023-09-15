//// Example

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
}

// Define the initial state using that type
const initialState: SupportState = {
  pendingMessages: [],
};

interface MyReturnType {
  // ...
}

const getUserCount = createAsyncThunk<MyReturnType, number>(
  'file/fileUpload',
  async (userId: number) => {
    // const response = await userAPI.fetchById(userId)
    return 2;
  },
);

export const SupportSlice = createSlice({
  name: 'fileUpload',
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
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getUserCount.fulfilled, (state, action) => {
      // Add user to the state array
      // state.value = 10;
    });
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = SupportSlice;

export const {
  addPendingMessage,
  removeFromPendingMessage,
  updatePendingMessage,
} = actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.support;

export default reducer;
