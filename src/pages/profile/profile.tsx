import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { selectUpdateUserError, selectUser } from '@selectors';
import { updateUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUpdateUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData = formValue.password
      ? formValue
      : { name: formValue.name, email: formValue.email };

    dispatch(updateUser(userData))
      .unwrap()
      .then(() => {
        setFormValue((currentFormValue) => ({
          ...currentFormValue,
          password: ''
        }));
      })
      .catch(() => undefined);
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
