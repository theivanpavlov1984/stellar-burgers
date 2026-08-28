import { FC, useEffect } from 'react';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { Preloader } from '@ui';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '@selectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

type BackgroundLocationState = {
  background?: Location;
};

const IngredientModal: FC = () => {
  const navigate = useNavigate();

  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const IngredientPage: FC = () => (
  <main className={styles.detailPageWrap}>
    <h1 className={`${styles.detailHeader} text text_type_main-large mb-5`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </main>
);

const OrderPage: FC = () => {
  const { number } = useParams();

  return (
    <main className={styles.detailPageWrap}>
      <p
        className={`${styles.detailHeader} text text_type_digits-default mb-10`}
      >
        #{String(number ?? '').padStart(6, '0')}
      </p>
      <OrderInfo />
    </main>
  );
};

const OrderModal: FC = () => {
  const navigate = useNavigate();
  const { number } = useParams();

  return (
    <Modal
      title={`#${String(number ?? '').padStart(6, '0')}`}
      onClose={() => navigate(-1)}
    >
      <OrderInfo />
    </Modal>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const locationState = location.state as BackgroundLocationState | null;
  const background = locationState?.background;

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const constructorRoute = isIngredientsLoading ? (
    <Preloader />
  ) : error ? (
    <div className={`${styles.error} text text_type_main-medium pt-4`}>
      {error}
    </div>
  ) : ingredients.length > 0 ? (
    <ConstructorPage />
  ) : (
    <div className={`${styles.title} text text_type_main-medium pt-4`}>
      Нет ингредиентов
    </div>
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path='/' element={constructorRoute} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderPage />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route path='/feed/:number' element={<OrderModal />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
