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

    state = {
        clientHeight: 0,
        prevScrollHeight: 0,
        loading: false
    };

    componentDidMount() {
        // const {params, UIActions, ChannelActions} = this.props;
        // const { ChatActions } = this.props;
        // ChatActions.initialize('abc');

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
        const {params, ChatActions, intl} = this.props;
        // const { ChatActions } = this.props;
        // console.log(this.props);

        // const promises = [
        //     ChannelActions.getRecentMsg(params.username),
        //     ChannelActions.getStatusMessage(params.username)
        // ];

        // try {
        //     await Promise.all(promises);
        // } catch(e) {
        //     console.log(e);
        // }

        // get recent message

        try{
            ChatActions.getRecentMsg();
        }catch( e ) {
            console.log(e);
        }

        // socket.init();
        // this.handleShowStatusMessage();
        socket.configure(intl);
    }

    handleFailure = (index) => {
        const {ChatActions} = this.props;
        ChatActions.messageFailure(index);
    }

    handleRemove = (index) => {
        console.log('handleRemove evented');

        const {ChatActions} = this.props;
        ChatActions.removeMessage(index);
    }

    handleScroll = (e) => {

        const scrollTop = this.scrollBox.getScrollTop();
        const scrollHeight = this.scrollBox.getScrollHeight();
        const clientHeight = this.scrollBox.getClientHeight();

        if(scrollTop < 60 && !this.state.loading && !this.props.status.top) {
            console.log('loading!');
            this.setState({
                loading: true,
                prevScrollHeight: scrollHeight
            });
            this.loadPrevious();
        }

        console.log(scrollTop, scrollHeight, clientHeight)
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
                anonymous: false, // to do 
                date: (new Date()).getTime(),
                message,
                uID,
                suID: uID,
                username: status.socket.username
            }
        });
        this.scrollToBottom();
    }

    shouldComponentUpdate(nextProps, nextState) {
        
        // update when client resize
        if (nextProps.status.clientHeight !== this.props.status.clientHeight) {
            return true;
        }

        // loading status won't affect rendering
        // prevScrollHeight won't affect rendering'
        if (nextState.loading !== this.state.loading) {
            return false;
        }

        const checkDiff = () => {
            if (nextProps.status.chatData.length > 0) {
                if (nextProps.status.chatData.length !== this.props.status.chatData.length) {
                    return true;
                }

                // check tempIndexes
                for (let index of this.props.status.tempDataIndex) {
                    if (nextProps.status.chatData[index].payload.suID !== this.props.status.chatData[index].payload.suID) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }

        const compareObject = JSON.stringify({
            ...this.props.status,
            chatData: null
        }) !== JSON.stringify({
            ...nextProps.status,
            chatData: null
        });

        // if compareObject is false, it will do checkDiff
        return compareObject || checkDiff();

    }
    
    componentDidUpdate(prevProps, prevState) {
        
        const scrollHeight = this.scrollBox.getScrollHeight();

        if (prevProps.status.chatData.length !== this.props.status.chatData.length) {
            const scrollTop = this.scrollBox.getScrollTop();
            const clientHeight = this.scrollBox.getClientHeight();
            if(scrollHeight - scrollTop - clientHeight < 300 || this.state.prevScrollHeight - clientHeight < 300) {
                this.scrollToBottom();
            }
        }

        this.setState({
            prevScrollHeight: scrollHeight
        });
    }

    scrollToBottom = () => {
        // SCROLL TO BOTTOM
        this
            .scrollBox
            .scrollTop(this.scrollBox.getScrollHeight());
    }

    render () {
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
                    channel={'all'}
                    showLoader={!status.top}
                    onFailure={handleFailure}
                    onRemove={handleRemove}
                    onSend={handleSend}/>
            </Scrollbars>
            <Input onSend={handleSend} controlled={null}/>
        </Screen>
        )
    }

    componentWillUnmount() {
        /*
        console.log(socket);
        if (socket.getSocket()) {
            socket.close();
        }
        */
    }
}

export default connect(
    (state) => ({
        status: {
        // channelName: state.channel.info.username,
        // chatState: state.ui.channel.chat,
        session: state.auth.get('session').toJS(),
        socket: state.chat.getIn(['chat','socket']).toJS(),
        identity: state.chat.getIn(['chat','identity']),
        chatData: state.chat.getIn(['chat','data']).toJS(),
        tempDataIndex: state.chat.getIn(['chat','tempDataIndex']).toJS(),
        top: state.chat.getIn(['chat', 'top']),
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