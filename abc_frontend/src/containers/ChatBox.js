import React, { Component } from 'react'
import { Screen, MessageList, Input } from 'components';
import { Scrollbars } from 'react-custom-scrollbars';



class ChatBox extends Component {

    handleFailure = () => {
        console.log('handleFailure evented!');
    }
    handleRemove = () => {
        console.log('handleRemove evented!');
    }
    handleSend = () => {
        console.log('handleSend evented!');
    }

    render () {
        const status ={
            chatData: [],
            top: false
        };

        const {handleFailure, handleRemove, handleSend} = this;

        return (
        <Screen>
            <Scrollbars
                style={{
                width: '100%',
                height: '80%',
                borderBottom: '1px solid rgba(0,0,0,0.10)'
            }}
                className="scrollbox"
                ref={(ref) => {
                this.scrollBox = ref
            }}>
                <MessageList
                    data={status.chatData}
                    channel={'params.username'}
                    showLoader={!status.top}
                    onFailure={handleFailure}
                    onRemove={handleRemove}
                    onSend={handleSend}/>
            </Scrollbars>
            <Input onSend={handleSend} controlled={null}/>
        </Screen>
        )
    }
}

export default ChatBox