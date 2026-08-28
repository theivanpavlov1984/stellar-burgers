import React, { FC } from 'react';
import clsx from 'clsx';
import { Link, NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  pathname = '/'
}) => {
  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients/');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={clsx(styles.link, {
              [styles.link_active]: isConstructorActive
            })}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={clsx(styles.link, {
              [styles.link_active]: isFeedActive
            })}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <Link className={styles.logo} to='/'>
          <Logo className='' />
        </Link>
        <NavLink
          to='/profile'
          className={clsx(styles.link, styles.link_position_last, {
            [styles.link_active]: isProfileActive
          })}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
