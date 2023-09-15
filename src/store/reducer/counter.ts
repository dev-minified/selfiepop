//// Example

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCounterLabel } from 'api/Utils';
import type { RootState } from '../store';

// Define a type for the slice state
interface CounterState {
  value: number;
  member: number;
  pending: number;
  subscription: number;
  unreadMessage: number;
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 0,
  member: 0,
  pending: 0,
  subscription: 0,
  unreadMessage: 0,
};

interface MyReturnType {
  // ...
}

export const getUserCount = createAsyncThunk<CounterState>(
  'users/getUserCount',
  async () => {
    // const response = await userAPI.fetchById(userId)
    const response = await getCounterLabel();
    return response;
  },
);

export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    incrementUnreadMessageCount: (state) => {
      state.unreadMessage += 1;
    },
    headerCount: (state, action) => {
      delete action?.payload?.success;
      state.member = action.payload.member;

      state.pending = action.payload.pending;
      state.subscription = action.payload.subscription;
      state.unreadMessage = action.payload.unreadMessage;
    },
    resetHeadersCount: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getUserCount.fulfilled, (state, action) => {
      state.member = action.payload.member;

      state.pending = action.payload.pending;
      state.subscription = action.payload.subscription;
      state.unreadMessage = action.payload.unreadMessage;
    });
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = counterSlice;

export const {
  increment,
  decrement,
  incrementByAmount,
  headerCount,
  resetHeadersCount,
  incrementUnreadMessageCount,
} = actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;

export default reducer;
