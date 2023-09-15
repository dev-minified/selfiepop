//// Example
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HeaderState {
  title?: string;
  backUrl?: string;
  shareModal?: boolean;
  purchaseBackUrl?: string;
  isPurchaseHeader?: boolean;
  showHeader?: boolean;
}

const initialState: HeaderState = {
  title: '',
  backUrl: '#',
  shareModal: false,
  purchaseBackUrl: '',
  isPurchaseHeader: true,
  showHeader: true,
};

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeaderTitle: (state, { payload }) => {
      state.title = payload;
    },
    setHeaderUrl: (state, { payload }) => {
      state.backUrl = payload;
    },
    setPurchaseHeaderUrl: (state, { payload }) => {
      state.purchaseBackUrl = payload;
    },
    setIsPurchaseHeader: (state, { payload }) => {
      state.isPurchaseHeader = payload;
    },
    resetPurchaseHeader: (state) => {
      state.isPurchaseHeader = true;
      state.purchaseBackUrl = undefined;
    },
    setHeaderProps: (
      state,
      action: PayloadAction<
        Pick<HeaderState, 'title' | 'backUrl' | 'showHeader'>
      >,
    ) => {
      state.title = action.payload.title;
      state.backUrl = action.payload.backUrl;
      state.showHeader = action.payload.showHeader;
    },
    toggleModal: (state) => {
      state.shareModal = !state.shareModal;
    },
  },
  extraReducers: (builder) => {},
});

const { actions, reducer } = headerSlice;

export const {
  setHeaderTitle,
  setHeaderProps,
  setHeaderUrl,
  toggleModal,
  setPurchaseHeaderUrl,
  setIsPurchaseHeader,
  resetPurchaseHeader,
} = actions;

export default reducer;
