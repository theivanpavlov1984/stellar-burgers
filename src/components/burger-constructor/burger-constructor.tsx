import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectConstructorPrice,
  selectOrderModalData,
  selectOrderRequest,
  selectUser
} from '@selectors';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { closeOrderModal, createOrder } from '../../services/slices/orderSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const price = useSelector(selectConstructorPrice);
  const user = useSelector(selectUser);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
        dispatch(fetchFeeds());
        dispatch(fetchUserOrders());
      })
      .catch(() => undefined);
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
