import React from 'react'
import { PageTemplate, GameRoom } from 'components';
import { HeaderContainer } from 'containers';
import { ChatBox, GameRoomContainer } from 'containers';
import './GameRoomPage.scss';

const GameRoomPage = (props) => {
  console.log('GameRoomPage +++++++++++++++++++');
  return (
    <PageTemplate header={<HeaderContainer/>} padding={'3.5rem'} responsive>
      <div className='game-room-page'>
        <GameRoomContainer type={props.match.params.type} gameId = {props.match.params.id}/>
        <ChatBox />
      </div>
    </PageTemplate>
  )
}

export default GameRoomPage