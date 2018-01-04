import React from 'react';
import styles from './Header.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const Header = ({onClickButton}) => {
  return (
    <div className={cx('header')}>
      <div>
        <Link to="/">
          <div className={cx('loger')} >
            <div className = 'markimg'/>
            <div className = 'marktxt'>
              BitCoin Poker
            </div>
          </div>
        </Link>
      </div>
      <div className = 'header_buttons'>
        <div className='button_item'>
          <Link to="/">My Wallet</Link>
        </div>
        <div className='button_item'>
          <Link to="/signup">REGISTER</Link>
        </div>
        <div className='button_item'>
          <Link to="/login">LOGIN</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;