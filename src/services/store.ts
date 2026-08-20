import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import userOrdersReducer from './slices/userOrdersSlice';
import orderDetailsReducer from './slices/orderDetailsSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer,
  orderDetails: orderDetailsReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
