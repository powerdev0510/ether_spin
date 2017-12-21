import React from 'react';
import styles from './Header.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Header = ({onClickButton}) => {
  return (
    <div className={cx('header')}>
      <a className={cx('loger')} onClick={onClickButton}>BitCoin Poker</a>
    </div>
  );
};

export default Header;