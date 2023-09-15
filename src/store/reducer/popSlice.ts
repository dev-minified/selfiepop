//// Example
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
interface PopState {
  pop: Partial<IUserLink>;
  previewPop: Partial<IUserLink> & { isTemp?: boolean };
  enableTheme?: boolean;
}

// Define the initial state using that type
const initialState: PopState = {
  pop: {},
  previewPop: {},
  enableTheme: true,
};

export const popSlice = createSlice({
  name: 'popslice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePop: (state, { payload }) => {
      state.pop = { ...state.pop, ...payload };
    },
    addPop: (state, { payload }) => {
      const { addPop, ...rest } = payload;
      if (addPop) {
        state.previewPop = { ...rest };
      }
      state.pop = { ...rest };
    },
    removePop: (state) => {
      return initialState;
    },
    updatePreviewPop: (state, { payload }) => {
      state.previewPop = { ...state.previewPop, ...payload };
      state.enableTheme = false;
    },
    addPreviewPop: (state, { payload }) => {
      const { addPop, ...rest } = payload;
      state.previewPop = { ...rest };
      state.enableTheme = false;
      if (addPop) {
        state.pop = { ...rest };
      }
    },
    removePreviewPop: (state) => {
      state.previewPop = {};
      state.enableTheme = true;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
  extraReducers: (builder) => {},
});

// Extract the action creators object and the reducer
const { actions, reducer } = popSlice;

export const { addPop, removePop, addPreviewPop, removePreviewPop } = actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.popslice;

export default reducer;
