import React, { Component } from 'react'

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from 'store/modules/game';
import * as formActions from 'store/modules/form';

import {injectIntl, defineMessages} from 'react-intl';
import { prepareMessages } from 'locale/helper';

import { GameRoom } from 'components';

class GameRoomContainer extends Component {

    render () {
        return (
          <GameRoom {...this.props}/>
        )
    }
}

export default connect(
    (state) => ({
        form: state.form.get('deposit').toJS(),
        status: {
        // channelName: state.channel.info.username,
        // chatState: state.ui.channel.chat,
        session: state.auth.get('session').toJS(),
        userId:  state.auth.getIn(['session', 'user', '_id']),
        // socket: state.chat.getIn(['chat','socket']).toJS(),
        // identity: state.chat.getIn(['chat','identity']),
        // chatData: state.chat.getIn(['chat','data']).toJS(),
        // tempDataIndex: state.chat.getIn(['chat','tempDataIndex']).toJS(),
        // top: state.chat.getIn(['chat', 'top']),
        // clientHeight: state.ui.clientSize.height,
        // userList: state.channel.chat.userList,
        // userCount: state.channel.chat.userList.length,
        // connected: state.channel.chat.socket.enter,
        // onlineList: state.ui.channel.chat.onlineList,
        // statusMessage: state.channel.chat.statusMessage,
        // statusMessageVisibility: state.ui.channel.chat.statusMessage
        // username : state.chat.get(['info', 'username']),
        join: state.game.get('join'),
        depositResult: state.game.getIn(['error', 'deposit']),
        game: state.game.getIn(['channel', 'game']).toJS(),
        gameState: state.game.getIn(['channel', 'game', 'state']),
        
        }
    }),
    (dispatch) => ({
      GameActions: bindActionCreators(gameActions, dispatch),
      FormActions: bindActionCreators(formActions, dispatch)
    })
  )(injectIntl(GameRoomContainer));