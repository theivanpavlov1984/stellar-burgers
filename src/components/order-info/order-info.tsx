import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  selectFeedOrders,
  selectIngredients,
  selectOrderDetails,
  selectOrderDetailsError,
  selectUserOrders
} from '@selectors';
import {
  clearOrderDetails,
  fetchOrderByNumber
} from '../../services/slices/orderDetailsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const fetchedOrder = useSelector(selectOrderDetails);
  const error = useSelector(selectOrderDetailsError);
  const ingredients = useSelector(selectIngredients);
  const orderFromList = [...feedOrders, ...userOrders].find(
    (order) => order.number === orderNumber
  );
  const orderData = orderFromList ?? fetchedOrder;

  useEffect(() => {
    if (Number.isFinite(orderNumber) && !orderFromList) {
      dispatch(fetchOrderByNumber(orderNumber));
    }

    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, orderFromList, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (error) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
