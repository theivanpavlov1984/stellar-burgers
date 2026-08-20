import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { getErrorMessage } from '../utils';

type OrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderDetailsState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orderDetails/fetch', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      return rejectWithValue('Заказ не найден');
    }

    return order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить заказ';
      });
  }
});

export const { clearOrderDetails } = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;
