import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '../../services/slices/userSlice';
import { clearUserOrders } from '../../services/slices/userOrdersSlice';
import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        dispatch(clearUserOrders());
        navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
