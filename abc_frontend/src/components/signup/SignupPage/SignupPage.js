import React from 'react';
import styles from './SignupPage.scss';
import classNames from 'classnames/bind';

import { PageTemplate, Register } from 'components';
import { HeaderContainer, RegisterContainer } from 'containers';

const cx = classNames.bind(styles);

const SignupPage = () => {
  return (
    <PageTemplate header={<HeaderContainer/>}  padding={'3.5rem'} responsive>
      <div className={cx('signup-page')}>
        <RegisterContainer />
      </div>
    </PageTemplate>
  );
};

export default SignupPage;