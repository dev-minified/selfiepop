import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as services from 'api/team-manager';
import { findUserByName } from 'api/User';

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

export const getTeamManagedUsers = createAsyncThunk<T[]>(
  `${modelName}/get
  TeamManagedUsers`,
  async () => {
    const res = await services.getTeamManagedUsersList();
    return res.data;
  },
);
export const getTeamManagedAccountById = createAsyncThunk<
  T[],
  {
    userId: string;
    params?: CustomErrorType;
  }
>(
  `${modelName}/getById
  TeamManagedUserById`,
  async ({ userId, params }) => {
    const res = await services.getMemberManagerAccountById(userId);
    return res;
  },
);
export const findUser = createAsyncThunk<
  T,
  {
    userName: string;
    params?: CustomErrorType;
  }
>(
  `${modelName}/getfindManagedUsers`,

  async ({ userName, params }) => {
    const { ignoreStatusCodes, ...rest } = params || {};
    const res = await findUserByName(userName, {
      rest,
      errorConfig: { ignoreStatusCodes: ignoreStatusCodes },
    });
    return res;
  },
);
export const inviteTeamManaged = createAsyncThunk<T, Record<string, any>>(
  `${modelName}/inviteTeamManaged`,
  async (data: any) => {
    const res = await services.teamMemberInvite(data);
    return res;
  },
);

export const slice = createSlice({
  name: modelName,
  initialState,
  reducers: {
    setTeamManagedUser: (state, action) => {
      state.item = action.payload;
    },
    resetTeamManagedUser: () => {
      return initialState;
    },

    findTeamManagedUser: (state, action) => {
      state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeamManagedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeamManagedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getTeamManagedUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(findUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.loading = false;
        state.item = { userId: action.payload || {} };
      })
      .addCase(findUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getTeamManagedAccountById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeamManagedAccountById.fulfilled, (state, action) => {
        state.loading = false;
        state.item = (action.payload as any)?.account;
      })
      .addCase(getTeamManagedAccountById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setTeamManagedUser, resetTeamManagedUser } = slice.actions;

export default slice.reducer;
