import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';

import {
  selectUserOrders,
  selectUserOrdersError,
  selectUserOrdersLoading
} from '@selectors';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
