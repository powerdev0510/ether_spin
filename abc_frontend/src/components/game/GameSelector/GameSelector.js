import React, { Component } from 'react'

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from 'store/modules/game';

import { GameCard } from 'components';
import './GameSelector.scss';
import * as gameSocket from 'socket-game';

import img1 from 'static/assets/game1.png';
import img2 from 'static/assets/game2.png';
import img3 from 'static/assets/game3.png';

import { withRouter } from 'react-router';

// GAME ROOM TYPE
const GAME_TYPE = {
  ONE : 0, // 1/1 
  TEN : 1, // 1/10
  HUNDRED : 2, // 1/100
  TENTHOUSAND : 3, // 1/10000
  MILLION : 4, // 1/1000000
}

class GameSelector extends Component {
  
  handleSelect = async (type) => {

    const { history, GameActions } = this.props;
    // FIND GAME
    try{
      await GameActions.findGame(type);
      const { gameId } = this.props;
      // document.location.href = `/game/${type}/id/${gameId}`;
      console.log('-------------------------Game Selector-------------------');
      console.log(gameId);
      gameSocket.init();
      history.push(`/game/${type}/id/${gameId}`);
    }catch(e){
      console.log(e);
    }

  }

  render () {
    return (
      <div className='gametype'>
          <GameCard gameType={1} imgData={img2} header="1 / 1" small="Roll the dice" key={1} onClick={() => this.handleSelect(GAME_TYPE.ONE)} />
          <GameCard gameType={2} imgData={img2} header="1 / 10" small="Roll the dice" key={2} onClick={() => this.handleSelect(GAME_TYPE.TEN)}/>
          <GameCard gameType={3} imgData={img2} header="1 / 100" small="Roll the dice" key={3} onClick={() => this.handleSelect(GAME_TYPE.HUNDRED)}/>
          <GameCard gameType={4} imgData={img2} header="1 / 10000" small="Roll the dice" key={4} onClick={() => this.handleSelect(GAME_TYPE.TENTHOUSAND)}/>
          <GameCard gameType={5} imgData={img2} header="1 / 1000000" small="Roll the dice" key={5} onClick={() => this.handleSelect(GAME_TYPE.MILLION)}/>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    gameId : state.game.getIn(['channel', 'game', '_id']),
  }),
  (dispatch) => ({
    GameActions: bindActionCreators(gameActions, dispatch),
  })
)(withRouter(GameSelector));

