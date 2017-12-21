import React from 'react';
import styles from './Screen.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Screen = ({children}) => {
    return (
        <div className={cx('screen', 'bounceInRight')}>
            <div className={cx('title')}>Chat Room</div>
            {children}
        </div>
    );
};

export default Screen;