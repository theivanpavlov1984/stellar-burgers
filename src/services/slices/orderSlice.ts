import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '@api';
import { TCreatedOrder } from '@utils-types';
import { getErrorMessage } from '../utils';

type OrderState = {
  data: TCreatedOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  data: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TCreatedOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredientIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось оформить заказ';
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;

export default orderSlice.reducer;
