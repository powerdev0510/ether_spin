import React, {Component} from 'react';

import styles from './Input.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function sleep(ms) {
    const p = new Promise((resolve, reject) => {
        setTimeout(()=>{resolve();}, ms);
    });

    return p;
}

class Input extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };

        this.input = null
    }

    handleSend = () => {
        const { onSend } = this.props;
        if (this.state.message==='' || this.props.controlled) return;

        onSend(this.state.message);

        this.setState({
            message: ''
        });

        this.input.focus();
    }

    handleChange = (e) => {
        this.setState({
            message: e.target.value
        });
    }

    handleKeyPress = (e) => {
        if (e.charCode === 13) {
            this.handleSend();
        }
    }

    render() {
        const { message } = this.state;
        const { controlled } = this.props;

        const {handleSend, handleChange, handleKeyPress} = this;

        return (
            <div className={controlled? cx('input',  'controlled') : cx('input')}>
                <div className={cx('message')}>
                    <input type="text" value={message} name="message" placeholder="Write a message" onChange={handleChange} onKeyPress={handleKeyPress} ref={(ref)=>{this.input = ref}}/>
                </div>
                <div className={cx('send-button')}>
                    <button className="circular ui icon button pink" onClick={handleSend}>
                        <i className="icon send"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default Input;