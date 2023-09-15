import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as services from 'api/rule';

const modelName = 'rule';
type T = Rule;

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

export const getRules = createAsyncThunk<T[], { sellerId?: string }>(
  `${modelName}/getRules`,
  async ({ sellerId }) => {
    const res = await services.getRules(sellerId);
    return res.Items;
  },
);

export const getRule = createAsyncThunk<T, { id: string; sellerId?: string }>(
  `${modelName}/getRule`,
  async ({ id, sellerId }) => {
    const res = await services.getRule(id, sellerId);
    return res.Item;
  },
);

export const updateRule = createAsyncThunk<
  T,
  { id: string; data: Partial<RuleMetadata>; sellerId?: string }
>(`${modelName}/updateRule`, async ({ id, data, sellerId }) => {
  const res = await services.updateRule(id, data, sellerId);
  return res.Attributes;
});

export const deleteRule = createAsyncThunk<
  void,
  { id: string; sellerId?: string }
>(`${modelName}/deleteRule`, async ({ id, sellerId }) => {
  await services.deleteRule(id, sellerId);
});

export const createRule = createAsyncThunk<
  T,
  { data: Partial<RuleMetadata>; sellerId?: string }
>(`${modelName}/createRule`, async ({ data, sellerId }) => {
  const res = await services.createRule(data, sellerId);
  return res.data;
});

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
      .addCase(getRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRules.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1,
        );
      })
      .addCase(getRules.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getRule.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRule.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(getRule.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteRule.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRule.fulfilled, (state, action) => {
        state.loading = false;
        const ruleIndex = state.list.findIndex(
          (rule) => rule.slug === action.meta.arg.id,
        );
        if (ruleIndex > -1) {
          state.list.splice(ruleIndex, 1);
        }
        if (state.item?.slug === action.meta.arg.id) {
          state.item = undefined;
        }
      })
      .addCase(deleteRule.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateRule.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRule.fulfilled, (state, action) => {
        state.loading = false;
        const ruleIndex = state.list.findIndex(
          (rule) => rule.slug === action.meta.arg.id,
        );
        if (ruleIndex > -1) {
          state.list.splice(ruleIndex, 1, {
            ...state.list[ruleIndex],
            ...action.meta.arg.data,
          });
        }
        if (state.item?.slug === action.meta.arg.id) {
          state.item = { ...state.item, ...action.meta.arg.data };
        }
      })
      .addCase(updateRule.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createRule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRule.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createRule.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetRuleState, setSelectedRule, setRules } = slice.actions;

export default slice.reducer;
