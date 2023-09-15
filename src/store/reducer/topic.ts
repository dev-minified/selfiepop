//// Example
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTopicById } from 'api/Topic';

interface ITopicState {
  currentTopic: any;
  totalTopic: any;
}

const initialState: ITopicState = {
  currentTopic: null,
  totalTopic: [],
};

export const getSingleTopic = createAsyncThunk<
  {
    data: any;
  },
  {
    topicId: string;
  }
>('topic/getSingleTopic', async ({ topicId }) => {
  const response = await getTopicById(topicId);
  return { data: response.data };
});

export const headerSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    getTopicIds: (state, { payload }) => {
      state.totalTopic = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSingleTopic.fulfilled, (state, action) => {
      state.currentTopic = action.payload.data;
    });
  },
});

const { actions, reducer } = headerSlice;

export const { getTopicIds } = actions;

export default reducer;
