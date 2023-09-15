//// Example

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPostAnalytics } from 'api/sales';
import { AxiosRequestConfig } from 'axios';

// Define a type for the slice state
interface StatisticsModalState {
  isOpen?: boolean;
  isModalOpen?: boolean;
  post?: Partial<IPost>;
  postStatistics?: IPostStatistics;
  fetchingPostStatistics?: boolean;
}

// Define the initial state using that type
const initialState: StatisticsModalState = {
  isOpen: false,
  isModalOpen: false,
  post: {},
  postStatistics: {},
  fetchingPostStatistics: false,
};
export const getPostStatistics = createAsyncThunk<
  { data: IPostStatistics },
  { postId: string; params?: Record<string, any>; options?: AxiosRequestConfig }
>('posts/statistics', async ({ postId, options, params }) => {
  const response = await getPostAnalytics(postId, params, options || {});
  return { data: response };
});

export const statisticModalSlice = createSlice({
  name: 'statisticModel',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    onToggleModal: (state, action) => {
      state.isOpen = action.payload.isOpen;
      state.isModalOpen = action.payload.isModalOpen;

      state.post = action.payload.post || {};
      state.postStatistics = action.payload.postStatistics || {};
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getPostStatistics.fulfilled, (state, action) => {
      // Add user to the state array
      // state.value = 10;
      state.fetchingPostStatistics = false;
      state.postStatistics = action.payload.data;
    });
    builder.addCase(getPostStatistics.pending, (state, action) => {
      // Add user to the state array
      // state.value = 10;
      state.fetchingPostStatistics = true;
    });
    builder.addCase(getPostStatistics.rejected, (state, action) => {
      // Add user to the state array
      // state.value = 10;
      state.fetchingPostStatistics = false;
    });
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = statisticModalSlice;

export const { onToggleModal } = actions;

// Other code such as selectors can use the imported `RootState` type

export default reducer;
