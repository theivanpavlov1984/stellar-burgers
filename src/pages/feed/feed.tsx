import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders
} from '@selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
