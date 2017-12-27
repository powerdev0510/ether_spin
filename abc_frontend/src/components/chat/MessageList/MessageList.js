import React, {Component} from 'react';
import { MessageChunk, Loader } from 'components';
import chunk from 'helpers/chunk';

import styles from './MessageList.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class MessageList extends Component {

    mapToChunks = (data) => {
        console.time("mapToChunks");

        const dataChunks = chunk(data, 20);
        const chunks = dataChunks.map((chunk, i) => (<MessageChunk
            data={chunk}
            key={chunk.length ? chunk[0].payload.suID : 0}
            previous={i === 0 ? null : data[i * 20 - 1].payload}
            index={i}
            last={i >= Math.floor(data.length / 20) - 4}
            onFailure={this.props.onFailure}
            onRemove={this.props.onRemove}
            onSend={this.props.onSend}
            channel={this.props.channel}
        />));

        console.timeEnd("mapToChunks");

        return chunks;
    }


    

    render() {
        const {data, showLoader} = this.props;
        const {mapToChunks} = this;
        const showLoader1 = false;
        return (
            <div className={cx('message-list')}>
                { showLoader1 ? <Loader/> : undefined }
                {mapToChunks(data)}
            </div>
        );
    }
}

export default MessageList;