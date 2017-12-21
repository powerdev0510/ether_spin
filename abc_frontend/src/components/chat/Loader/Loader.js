import React from 'react';

import styles from './Loader.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Loader = () => {
    return (
        <div className={cx('ui', 'active', 'centered', 'inline', 'loader')}></div>
    );
};

export default Loader;