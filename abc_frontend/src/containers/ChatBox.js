import React, { Component } from 'react'

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as chatActions from 'store/modules/chat';

import { Screen, MessageList, Input } from 'components';
import { Scrollbars } from 'react-custom-scrollbars';

import * as socket from 'socket';
import * as socketHelper from 'socket/helper';
import sender from 'socket/packetSender';
import {client as SEND} from 'socket/packetTypes';
import notify from 'helpers/notify';

import {injectIntl, defineMessages} from 'react-intl';
import { prepareMessages } from 'locale/helper';

class ChatBox extends Component {

    componentDidMount() {
        // const {params, UIActions, ChannelActions} = this.props;
        const { ChatActions } = this.props;
        ChatActions.initialize('abc');

        // UIActions.initialize('channel');
        // ChannelActions.initialize(params.username);
        // UIActions.setHeaderTransparency(false);
        // UIActions.setFooterVisibility(false);

        // disable overflow for 0.7 seconds
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            document.body.style.overflow = ""
        }, 700);


        this.connectToChannel();

    }

    connectToChannel = async () => {
        // const {params, ChannelActions, intl} = this.props;
        // const { ChatActions } = this.props;
        // console.log(this.props);
        const {intl} = this.props;

        // const promises = [
        //     ChannelActions.getRecentMsg(params.username),
        //     ChannelActions.getStatusMessage(params.username)
        // ];

        // try {
        //     await Promise.all(promises);
        // } catch(e) {
        //     console.log(e);
        // }

        // socket.init();
        // this.handleShowStatusMessage();
        socket.configure(intl);
    }

    handleFailure = () => {
        console.log('handleFailure evented!');
    }
    handleRemove = () => {
        console.log('handleRemove evented!');
    }
    handleSend = (message) => {
        console.log('handleSend evented!');
        const { sessionID, logged } = this.props.status.session;

        if(!sessionID || !logged) {
            notify({type: 'error', message: 'Please log in'});
            return;
        }

        // const {status, ChannelActions, FormActions} = this.props;
        const {status, ChatActions} = this.props;
        const uID = socketHelper.generateUID();
        const data = {
            message,
            uID
        };
        sender.message(data);
        ChatActions.writeMessage({
            type: SEND.MSG,
            payload: {
                anonymous: true, // status.identity === 'anonymous', // to do 
                date: (new Date()).getTime(),
                message,
                uID,
                suID: uID,
                username: status.socket.username
            }
        });
        // this.scrollToBottom();
    }

    render () {
        const status1 = {
            chatData : [],
            top: false
        };
        const { status }= this.props;
        console.log('[ChatBox] render func()');
        console.log(status.chatData);
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
                    showLoader={!status1.top}
                    onFailure={handleFailure}
                    onRemove={handleRemove}
                    onSend={handleSend}/>
            </Scrollbars>
            <Input onSend={handleSend} controlled={null}/>
        </Screen>
        )
    }
}

export default connect(
    (state) => ({
        status: {
        // channelName: state.channel.info.username,
        // chatState: state.ui.channel.chat,
        session: state.auth.get('session').toJS(),
        socket: state.chat.getIn(['chat','socket']),
        identity: state.chat.getIn(['chat','identity']),
        chatData: state.chat.getIn(['chat','data']).toJS(),
        // tempDataIndex: state.channel.chat.tempDataIndex,
        // top: state.channel.chat.top,
        // clientHeight: state.ui.clientSize.height,
        // userList: state.channel.chat.userList,
        // userCount: state.channel.chat.userList.length,
        // connected: state.channel.chat.socket.enter,
        // onlineList: state.ui.channel.chat.onlineList,
        // statusMessage: state.channel.chat.statusMessage,
        // statusMessageVisibility: state.ui.channel.chat.statusMessage
        username : state.chat.get(['info', 'username']),
        }
    }),
    (dispatch) => ({
      ChatActions: bindActionCreators(chatActions, dispatch)
    })
  )(injectIntl(ChatBox));