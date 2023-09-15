import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersList } from 'api/Order';
type ProfileVisitorType = {
  subscription?: ChatSubsType;
  activeMemberShip?: IPostMembership;
  selectedProfile?: IUser;
  isUserFetching: boolean;
};
const initialState: ProfileVisitorType = {
  isUserFetching: false,
  selectedProfile: undefined,
  subscription: undefined,
};
export const getProfileSub = createAsyncThunk<
  {
    data: any;
    userId: string;
    type: string;
    popType: string;
  },
  {
    userId: string;
    type: string;
    popType: string;
  }
>('visitorProfile/getProfileSub', async ({ userId, type, popType }) => {
  const data = await getOrdersList({
    userId,
    type: type,
    popType: popType,
  });
  return { data, userId, type, popType };
});
export const VisitorSlice = createSlice({
  name: 'profileVisitor',
  initialState,
  reducers: {
    setVisitorProfile: (state, action) => {
      state.selectedProfile = action.payload;
    },
    setActiveProfileMemberShip: (state, action) => {
      state.activeMemberShip = action.payload;
    },
    setProfileSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    resetVisitorProfile: (state) => {
      state.activeMemberShip = undefined;
      state.selectedProfile = undefined;
      state.subscription = undefined;
    },
  },
  extraReducers: (builder) => {},
});

// Extract the action creators object and the reducer
const { actions, reducer } = VisitorSlice;

export const {
  setVisitorProfile,
  setProfileSubscription,
  setActiveProfileMemberShip,
  resetVisitorProfile,
} = actions;

// Other code such as selectors can use the imported `RootState` type

export default reducer;
