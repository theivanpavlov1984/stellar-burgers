import { FC } from 'react';
import { useLocation } from 'react-router-dom';

import { AppHeaderUI } from '@ui';
import { selectUser } from '@selectors';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();

  return <AppHeaderUI userName={user?.name} pathname={pathname} />;
};
