import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as services from 'api/managed-users';

const modelName = 'managed-users';
type T = any;

export interface IState {
  loading: boolean;
  list: T[];
  item?: T;
}

const initialState: IState = {
  list: [],
  loading: false,
  item: undefined,
};
export const getManagedAccountById = createAsyncThunk<
  T[],
  {
    userId: string;
    params?: CustomErrorType;
  }
>(
  `${modelName}/getById
  TeamManagedUserById`,
  async ({ userId, params }) => {
    const res = await services.getManagedAccountById(userId);
    return res;
  },
);
export const getManagedUsers = createAsyncThunk<T[]>(
  `${modelName}/getManagedUsers`,
  async () => {
    const res = await services.getManagedUsers();
    return res.data;
  },
);

export const getManagedUserDetails = createAsyncThunk<T[], { userId: string }>(
  `${modelName}/getManagedUserDetails`,
  async ({ userId }) => {
    const res = await services.getManagedUserDetails(userId);
    return res;
  },
);

export const slice = createSlice({
  name: modelName,
  initialState,
  reducers: {
    setManagedUser: (state, action) => {
      state.item = action.payload;
    },
    updateManagedUsers: (state, action) => {
      const itemIndex = state.list.findIndex(
        (Litem) => Litem?._id === action.payload?.sellerId,
      );
      if (itemIndex !== -1) {
        state.list[itemIndex] = {
          ...state.list[itemIndex],
          unread: action.payload?.unread,
          subscription: action.payload?.subscription,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getManagedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getManagedUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getManagedUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagedUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(getManagedUserDetails.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getManagedAccountById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagedAccountById.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(getManagedAccountById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setManagedUser, updateManagedUsers } = slice.actions;

export default slice.reducer;
