//// Example

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import themes from 'theme/theme';
import { getLocalStorage } from 'util/index';

// Define a type for the slice state
type AppThemeType = {
  apptheme: IAppTheme;
};
const themeMode = getLocalStorage('sp_theme', false) as IThemeMode;
const themmemode: IThemeMode = themeMode || 'dark';
const selectedTheme = themes[themmemode];
// Define the initial state using that type
const initialState: AppThemeType = {
  // theme: isDark ? { ...theme, ...darkMode } : theme,
  apptheme: selectedTheme,
};

interface MyReturnType {
  // ...
}

export const appThemeSlice = createSlice({
  name: 'sp_apptheme',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.apptheme = action.payload;
    },
    resetTheme: (state) => {
      state.apptheme = themes.light;
    },
    toggleTheme: (state) => {
      if (state.apptheme.mode !== 'dark') {
        state.apptheme = themes.dark;
      } else {
        state.apptheme = themes.light;
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = appThemeSlice;

export const { setTheme, resetTheme, toggleTheme } = actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTheme = (state: RootState) => state.appTheme.apptheme;

export default reducer;
