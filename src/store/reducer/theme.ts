//// Example
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getThemeByIds } from 'api/theme';
import { RootState } from 'store/store';

interface IThemeState {
  allthemes: ITheme[];
  current?: ITheme;
  systemThemes: ITheme[];
  // reflectProfileImage?: boolean;
  categories?: [];
  totalThemesCount?: { userThemeCount: number; systemthemeCount: number };
  rendering?: string[];
}

const initialState: IThemeState = {
  allthemes: [],
  current: undefined,
  systemThemes: [],
  categories: [],
  totalThemesCount: {
    userThemeCount: 0,
    systemthemeCount: 0,
  },
  rendering: [],
};

export const updateRendering = createAsyncThunk<
  ITheme[],
  void,
  { state: RootState }
>(
  `theme/updateRendering`,
  async (_, { getState }) => {
    const renderingList = getState().theme.rendering;
    if (renderingList) {
      const res = await getThemeByIds(renderingList);
      return res;
    }

    return [];
  },
  {
    condition(_, { getState }) {
      const renderingList = getState().theme.rendering;
      return renderingList && renderingList.length > 0;
    },
  },
);

export const headerSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemes: (state, { payload }) => {
      state.allthemes = payload;
    },
    setThemesCount: (state, { payload }) => {
      state.totalThemesCount = payload;
    },
    setCurrentTheme: (state, { payload }) => {
      state.current = payload;
    },
    setSystemThemes: (state, { payload }) => {
      state.systemThemes = payload;
    },
    pushSystemThemes: (state, { payload }) => {
      const themes = state.systemThemes?.filter(
        (theme) => !payload.find((t: ITheme) => t._id === theme._id),
      );
      state.systemThemes = [...(themes || []), ...payload];
    },
    pushRendering: (state, action: PayloadAction<string[]>) => {
      const renderingList = state.rendering ? [...state.rendering] : [];
      action.payload.forEach((item) => {
        if (!renderingList.includes(item)) {
          renderingList.push(item);
        }
      });

      state.rendering = renderingList;
    },
    setCategories: (state, { payload }) => {
      state.categories = payload;
    },
    restThemeState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateRendering.fulfilled, (state, action) => {
      state.systemThemes = state.systemThemes.map((theme) => {
        if (!theme.isRendering) {
          return theme;
        }
        const payloadTheme = action.payload.find((t) => t._id === theme._id);

        if (!payloadTheme) {
          return theme;
        }

        return !payloadTheme.isRendering
          ? { ...theme, isRendering: payloadTheme.isRendering }
          : theme;
      });

      state.allthemes = state.allthemes.map((theme) => {
        if (!theme.isRendering) {
          return theme;
        }
        const payloadTheme = action.payload.find((t) => t._id === theme._id);

        if (!payloadTheme) {
          return theme;
        }

        return !payloadTheme.isRendering
          ? { ...theme, isRendering: payloadTheme.isRendering }
          : theme;
      });

      if (state.current?.isRendering) {
        const currentTheme = action.payload.find(
          (t) => t._id === state.current?._id,
        );

        if (currentTheme && !currentTheme.isRendering) {
          state.current.isRendering = currentTheme.isRendering;
        }
      }
    });
  },
});

const { actions, reducer } = headerSlice;

export const {
  setThemes,
  setThemesCount,
  setCurrentTheme,
  setSystemThemes,
  setCategories,
  restThemeState,
  pushSystemThemes,
  pushRendering,
} = actions;

export default reducer;
