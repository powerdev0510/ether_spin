import React from 'react';
import { LoginContainer, HeaderContainer } from 'containers';

import { PageTemplate } from 'components';
import styles from './LoginPage.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);



const LoginPage = () => {
  return (
    <PageTemplate header={<HeaderContainer/>}  padding={'3.5rem'} responsive>
      <div className={cx('signup-page')}>
      <LoginContainer />
      </div>
    </PageTemplate>
  );
};

export default LoginPage;