import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as services from 'api/managed-accounts';

const modelName = 'team-managed-users';
type T = any;

export interface IState {
  loading: boolean;
  list: T[];
  item?: T;
  findUser?: T;
}

const initialState: IState = {
  list: [],
  loading: false,
  item: undefined,
  findUser: undefined,
};

export const getManagedAccountsOffers = createAsyncThunk<T[]>(
  `${modelName}/get
  TeamManagedUsers`,
  async () => {
    const res = await services.getManagedAccounts();
    return res.data;
  },
);

export const slice = createSlice({
  name: modelName,
  initialState,
  reducers: {
    setManagedAccounts: (
      state: IState,
      action: PayloadAction<IState['item']>,
    ) => {
      state.item = action.payload;
    },
    resetManagedAccounts: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getManagedAccountsOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagedAccountsOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getManagedAccountsOffers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setManagedAccounts, resetManagedAccounts } = slice.actions;

export default slice.reducer;
