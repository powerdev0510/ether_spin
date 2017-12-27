import React from 'react'
import { PageTemplate, GameRoom } from 'components';
import { HeaderContainer } from 'containers';
import { ChatBox } from 'containers';
import './GameRoomPage.scss';

const GameRoomPage = () => {

  return (
    <PageTemplate header={<HeaderContainer/>} padding={'3.5rem'} responsive>
      <div className='game-room-page'>
        <GameRoom />
        <ChatBox />
      </div>
    </PageTemplate>
  )
}

export default GameRoomPage