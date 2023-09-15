//// Example
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrders } from 'api/Order';
import { AxiosRequestConfig } from 'axios';

// Define a type for the slice state
interface IOrderState {
  orders: { items: IOrderType[]; totalCount?: number };
  isOrderFetching?: boolean;
  isOrdersFetching?: boolean;
  selectedOrder?: IOrderType;
}

// Define the initial state using that type
const initialState: IOrderState = {
  orders: { items: [], totalCount: 0 },
  isOrderFetching: false,
  isOrdersFetching: false,
};

export const getSalesOrders = createAsyncThunk<
  IOrderState['orders'],
  {
    callback?: (...args: any) => void;
    options?: AxiosRequestConfig;
  }
>('salesOrders/getSalesOrders', async ({ callback, options }) => {
  const response = await getOrders(options);
  callback?.(response);
  return response;
});

export const OrdersSlice = createSlice({
  name: 'SalesOrders',
  initialState,
  reducers: {
    resetSalesOrders: () => {
      return initialState;
    },
    setSalesOrders: (state, action) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSalesOrders.pending, (state, action) => {
      state.isOrderFetching = true;
    });
    builder.addCase(getSalesOrders.rejected, (state, action) => {
      state.isOrderFetching = false;
    });
    builder.addCase(getSalesOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.isOrderFetching = false;
    });
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = OrdersSlice;

export const { setSalesOrders, setSelectedOrder, resetSalesOrders } = actions;

// Other code such as selectors can use the imported `RootState` type

export default reducer;
