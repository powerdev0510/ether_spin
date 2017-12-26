import React from 'react';
import { LoginContainer } from 'containers';

import styles from './LoginPage.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);



const LoginPage = () => {
  return (
    <div className={cx('login-page')}>
      <LoginContainer />
    </div>
  );
};

export default LoginPage;