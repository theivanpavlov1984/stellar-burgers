import { FC, ReactElement } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { selectIsAuthChecked, selectUser } from '@selectors';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

type LocationState = {
  from?: Location;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to={locationState?.from?.pathname ?? '/'} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
