import React from 'react';
import userThumbnail from 'static/assets/user.png';

import styles from './Thumbnail.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Thumbnail = ({image}) => {
    return (
        <div className={cx('thumbnail')}>
            <div className={cx('circle')}>
                <div
                    className={cx('image')}
                    style={{
                    background: `url(${image}) no-repeat`,
                    backgroundSize: 'cover'
                }}></div>

            </div>
        </div>
    );
};

Thumbnail.defaultProps = {
    image: userThumbnail
};

export default Thumbnail;
