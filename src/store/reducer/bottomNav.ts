import { createSlice } from '@reduxjs/toolkit';

export interface IBottomNavType {
  showNav?: boolean;
  applyClass?: boolean;
}

// Define the initial state using that type
const initialState: IBottomNavType = {
  showNav: true,
  applyClass: false,
};

export const bottomNavSlice = createSlice({
  name: 'bottomNav',
  initialState,
  reducers: {
    onToggleBottomNav: (state, action: { payload: IBottomNavType }) => {
      if (action.payload['showNav'] !== undefined)
        state.showNav = action.payload.showNav;
      if (action.payload['applyClass'] !== undefined)
        state.applyClass = action.payload.applyClass;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = bottomNavSlice;

export const { onToggleBottomNav } = actions;

// Other code such as selectors can use the imported `RootState` type

export default reducer;
