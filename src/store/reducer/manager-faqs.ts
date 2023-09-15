import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as services from 'api/manager-faqs';

const modelName = 'manager-faqs';
type T = ManagerFAQ;

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

export const getManagerFaqsList = createAsyncThunk<T[], { sellerId: string }>(
  `${modelName}/getManagerFaqsList`,
  async ({ sellerId }) => {
    const res = await services.getManagerFaqsList(sellerId);
    return res.items;
  },
);

export const getManagerFaq = createAsyncThunk<T, { id: string }>(
  `${modelName}/getManagerFaq`,
  async ({ id }) => {
    const res = await services.getManagerFaq(id);
    return res;
  },
);

export const updateManagerFaq = createAsyncThunk<
  T,
  { id: string; data: Partial<ManagerFAQ> }
>(`${modelName}/updateManagerFaq`, async ({ id, data }) => {
  const res = await services.updateManagerFaq(id, data);
  return res;
});

export const deleteManagerFaq = createAsyncThunk<void, { id: string }>(
  `${modelName}/deleteManagerFaq`,
  async ({ id }) => {
    await services.deleteManagerFaq(id);
  },
);

export const createManagerFaq = createAsyncThunk<T, { data: ManagerFAQ }>(
  `${modelName}/createManagerFaq`,
  async ({ data }) => {
    const res = await services.createManagerFaq(data);
    return res;
  },
);

export const slice = createSlice({
  name: modelName,
  initialState,
  reducers: {
    setSelectedRule: (state, action) => {
      state.item = action.payload;
    },
    resetRuleState: (state) => {
      state = initialState;
    },
    setRules: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getManagerFaqsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagerFaqsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getManagerFaqsList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getManagerFaq.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagerFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(getManagerFaq.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteManagerFaq.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteManagerFaq.fulfilled, (state, action) => {
        state.loading = false;
        const faqIndex = state.list.findIndex(
          (faq) => faq._id === action.meta.arg.id,
        );
        if (faqIndex > -1) {
          state.list.splice(faqIndex, 1);
        }
        if (state.item?._id === action.meta.arg.id) {
          state.item = undefined;
        }
      })
      .addCase(deleteManagerFaq.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateManagerFaq.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateManagerFaq.fulfilled, (state, action) => {
        state.loading = false;
        const faqIndex = state.list.findIndex(
          (faq) => faq._id === action.meta.arg.id,
        );
        if (faqIndex > -1) {
          state.list.splice(faqIndex, 1, {
            ...state.list[faqIndex],
            ...action.meta.arg.data,
          });
        }
        if (state.item?._id === action.meta.arg.id) {
          state.item = { ...state.item, ...action.meta.arg.data };
        }
      })
      .addCase(updateManagerFaq.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createManagerFaq.pending, (state) => {
        state.loading = true;
      })
      .addCase(createManagerFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createManagerFaq.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetRuleState, setSelectedRule, setRules } = slice.actions;

export default slice.reducer;
