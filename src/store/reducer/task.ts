import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as services from 'api/tasks';
import dayjs from 'dayjs';
import { getLocalStorage } from 'util/index';

const modelName = 'subscription-task';
type T = SubscriptionTask;

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

export const getSubscriptionTasks = createAsyncThunk<
  T[],
  { subscriptionId: string; sellerId?: string }
>(`${modelName}/getSubscriptionTasks`, async ({ sellerId, subscriptionId }) => {
  const res = await services.getSubscriptionTasks(subscriptionId, sellerId);
  return res.Items;
});

export const markTaskAsComplete = createAsyncThunk<
  T[],
  {
    data: {
      subscriptionId: string;
      taskSlug: string;
      subTaskIndex?: number;
    };
    sellerId?: string;
  }
>(`${modelName}/markTaskAsComplete`, async ({ sellerId, data }) => {
  const res = await services.markTaskAsComplete(data, sellerId);
  return res.Attributes;
});

export const slice = createSlice({
  name: modelName,
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.item = action.payload;
    },
    resetTaskState: (state) => {
      state = initialState;
    },
    setTasks: (state, action) => {
      state.list = action.payload;
    },
    addTask: (state, action: PayloadAction<T>) => {
      state.list.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscriptionTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1,
        );
      })
      .addCase(getSubscriptionTasks.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markTaskAsComplete.fulfilled, (state, action) => {
        const task = state.list.find(
          (item) => item.slug === action.meta.arg.data.taskSlug,
        );
        if (task) {
          const user = getLocalStorage('user');
          const userObj = {
            _id: user?._id,
            username: user?.username,
          };
          if (
            action.meta.arg.data.subTaskIndex != null &&
            task.taskData.taskSteps?.[action.meta.arg.data.subTaskIndex]
          ) {
            const subTask =
              task.taskData.taskSteps[action.meta.arg.data.subTaskIndex];
            subTask.isComplete = true;
            subTask.completedOn = dayjs().format('MM/DD/YYYY');
            subTask.completedBy = userObj;
          } else {
            task.completedOn = dayjs().format('MM/DD/YYYY');
            task.completedBy = userObj;
          }
        }
      });
  },
});

export const { resetTaskState, setSelectedTask, setTasks, addTask } =
  slice.actions;

export default slice.reducer;
