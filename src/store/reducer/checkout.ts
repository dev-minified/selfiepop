import { getLocalStorage } from 'util/index';
//// Example
import { createSlice } from '@reduxjs/toolkit';
import { removeLocalStorage, setLocalStorage } from 'util/index';

interface IPurchaseStatesReducer {
  guestUser?: any;
  order?: any;
  tokens?: {
    token?: string;
    refreshToken?: string;
  };
}

const initialState: IPurchaseStatesReducer = {
  guestUser: getLocalStorage('guestUser'),
  order: getLocalStorage('order'),
  tokens: getLocalStorage('guestTokens'),
};

export const headerSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setGuestUser: (state, { payload }) => {
      setLocalStorage('guestUser', payload);
      state.guestUser = payload;
    },
    setGuestUserTokens: (state, { payload }) => {
      setLocalStorage('guestTokens', { ...payload });
      state.tokens = payload;
    },
    setOrder: (state, { payload }) => {
      setLocalStorage('order', payload);
      state.order = payload;
    },
    resetCheckoutStates: (state) => {
      removeLocalStorage('guestUser');
      removeLocalStorage('order');
      state = {};
    },
    resetOrder: (state) => {
      removeLocalStorage('order');
      state.order = undefined;
    },
  },
  //   extraReducers: (builder) => {},
});

const { actions, reducer } = headerSlice;

export const {
  setGuestUser,
  setOrder,
  resetCheckoutStates,
  resetOrder,
  setGuestUserTokens,
} = actions;

export default reducer;
