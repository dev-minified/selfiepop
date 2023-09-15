//// Example
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
interface PopState {
  attendieInfo?: {
    verificationStage?: number;
    spPromptSent?: number;
    eventCount?: number;
    isVIP?: number;
    instagramUsername?: string;
    phoneNumber?: string;
    attendeeName?: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  };
}

// Define the initial state using that type
const initialState: PopState = {};

export const eventSlice = createSlice({
  name: 'eventSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAttende: (state, { payload }) => {
      state.attendieInfo = payload;
    },

    // Use the PayloadAction type to declare the contents of `action.payload`
  },
  extraReducers: (builder) => {},
});

// Extract the action creators object and the reducer
const { actions, reducer } = eventSlice;

export const { addAttende } = actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.eventSlice;

export default reducer;
