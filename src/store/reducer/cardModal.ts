//// Example
import { createSlice } from '@reduxjs/toolkit';

interface IAppState {
  isOpen: boolean;
  callback?: any;
}

const initialState: IAppState = {
  isOpen: false,
};

export const headerSlice = createSlice({
  name: 'cardModal',
  initialState,
  reducers: {
    onCardModalOpen: (state) => {
      state.isOpen = true;
    },
    onCardModalClose: (state) => {
      state.isOpen = false;
    },
    setCallbackForPayment: (state, action) => {
      state.callback = action.payload;
    },
    removeCallbackForPayment: (state) => {
      state.callback = undefined;
    },
  },
  //   extraReducers: (builder) => {},
});

const { actions, reducer } = headerSlice;

export const {
  onCardModalOpen,
  onCardModalClose,
  setCallbackForPayment,
  removeCallbackForPayment,
} = actions;

export default reducer;
