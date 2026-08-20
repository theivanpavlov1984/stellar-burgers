import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
export const selectConstructorPrice = (state: RootState) =>
  (state.burgerConstructor.bun?.price ?? 0) * 2 +
  state.burgerConstructor.ingredients.reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );

export const selectOrderRequest = (state: RootState) => state.order.isLoading;
export const selectOrderModalData = (state: RootState) => state.order.data;
export const selectOrderError = (state: RootState) => state.order.error;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;
export const selectFeedStats = (state: RootState) => state.feed;

export const selectUserOrders = (state: RootState) => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.isLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.userOrders.error;

export const selectOrderDetails = (state: RootState) =>
  state.orderDetails.order;
export const selectOrderDetailsLoading = (state: RootState) =>
  state.orderDetails.isLoading;
export const selectOrderDetailsError = (state: RootState) =>
  state.orderDetails.error;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateError;
