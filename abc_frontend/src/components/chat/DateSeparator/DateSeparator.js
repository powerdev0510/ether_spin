import React from 'react';
import styles from './DateSeparator.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const DateSeparator = ({date}) => {

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formatted = date.toLocaleDateString([], dateOptions);

    return (
        <div className={cx('date-separator')}>
            <div className="line">
                <div className={cx('strike')}>
                    <span>{formatted}</span>
                </div>
            </div>
        </div>
    );
};

export default DateSeparator;