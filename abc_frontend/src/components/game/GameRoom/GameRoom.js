import React, { Component } from 'react'
import './GameRoom.scss';
import spinimg from 'static/assets/spin.png';
import { DepositForm } from 'components';
import notify from 'helpers/notify'
import * as gameSocket from 'socket-game';
import sender from 'socket-game/packetSender';
import { withRouter } from 'react-router';
import storage from 'helpers/storage';

let timerId = null;

const GAME_STATE = {
  OPEN : 0, 
  PLAY : 1, 
  CLOSE : 2,
}

class GameRoom extends Component {

  state={
    presentNumber:0,
    time: 100,
    spinning: false,
    spinAngle: 0,
    depositForm: false,
    animate: false
  }

  componentDidMount() {
    // console.log('did mount');
    // alert(`Game Type : ${this.props.type} Game No : ${this.props.gameId}`);
/*
    if(timerId)
      clearInterval(timerId);

    timerId = setInterval(() => {
      // console.log('timer'+this.state.time);
      if(this.state.time === 0) {
        if(timerId){
          clearInterval(timerId);
          return;
        }
      }
      this.setState({time: this.state.time-1});
    }, 1000);
*/
    this.connectToGame();

  }

  connectToGame = async () => {
    const { form, status, GameActions, type, gameId } = this.props;
    const { userId } = status;

    /*
    setTimeout(() => {
      sender.auth(userId, false);
    }, 5000);
    */

    try {
      await GameActions.getGameData(gameId)
    } catch(e) {
      console.log(e);
    }
  }

  componentDidUnount() {
    // if(timerId)
    //   clearInterval(timerId);
    
    // disconnect socket
    // gameSocket.close();
  }

  setRotate = () => {
    console.log('dkdkdkd');
    const rnd_ang = 30000+Math.floor(Math.random() * 10000);
    this.setState({spinAngle: rnd_ang, spinning: false});
  }

  handleSpin = () => {
    console.log('handleSpin clicked');
    this.setState({spinning: true});

    setTimeout(this.setRotate, 300);
  }

  handleJoin = () => {
    this.setState({depositForm: true});
  }

  handleDeposit = async () => {
    const { form, status, GameActions, type, gameId } = this.props;
    const { balance, amount } = form;
    const { userId, session } = status;

    // validate input
    const regex = /^[1-9]\d*$/;
    
    if (!regex.test(amount)) {
        //toastr.error('Please check your username or password');
        notify({type: 'error', message: 'Wrong Input!'});
        return;
    }

    const bal = parseInt(balance, 10), m=parseInt(amount, 10);
    console.log(balance);
    console.log(bal);
    if ( m > bal ){
      notify({type: 'error', message: 'Not enough'});
      return;
    }
    
    if(!session.logged || userId === null) {
      // alert('login first');
      notify({type: 'error', message: 'Please Login'});
      storage.set('redirect', {prevPath: this.props.location.pathname});
      setTimeout( ()=> {
        this.leaveTo('/login');
      }, 700);
      return;
    }
    // alert('handleDeposit ' + amount + ' userId ' + userId);

    // deposit process
    try {
      await GameActions.deposit(userId, type, gameId, amount);
      const { join, depositResult } = this.props.status;
      
      if(!join) {
        notify({type: 'error', message: depositResult});
        return;
      }
      notify({type: 'success', message: 'Successfully joined to this game'});
    } catch(e) {
      notify({type: 'error', message: 'Failed to deposit'});
      return;
    }

    this.setState({animate: true});
    setTimeout(() => {this.setState({depositForm: false, animate: false})}, 700);
  }

  handleCancel = () => {
    this.setState({animate: true});
    setTimeout(() => {this.setState({depositForm: false, animate: false})}, 700);
  }

  handleChange = (e) => {
    const {FormActions} = this.props;
    FormActions.changeInput({form: 'deposit', name: e.target.name, value: e.target.value})
  }

  leaveTo = (path) => {
    const { history } = this.props;
    history.push(path);
  }

  render () {
    /*
    const total = [10, 50, 100];
    // const i = Math.floor(Math.random() * 100) % 3;
    const i = 2;
    const presentNumber = Math.floor(Math.random() * total[i]);
    const angle = [216, 90, 306, 36, 342, 14.4, 356.4, 3.6].map((ang, i) => (Math.floor(Math.random() * (i+1) * 360)));
    */
    const { time, spinning, spinAngle } = this.state;

    const { handleSpin, handleJoin, handleDeposit, handleCancel, handleChange } = this;
    const { form, status } = this.props;
    const { game, gameState } = status;
    const { users, usernames, winners } = game;
    let winner_name = '';
    if(gameState === GAME_STATE.CLOSE && winners.length > 0 && Object.keys(usernames).length > 0 ){
      winner_name = usernames[winners[0]];
    }
    
    // const rnd_ang = 30000+Math.floor(Math.random() * 10000);
    
    if(gameState === GAME_STATE.PLAY){
      setTimeout(this.setRotate, 100);
    }

    return (
      <div>
        <div className='pie-chart' style = {{ display: gameState === GAME_STATE.OPEN ? 'block' : 'none' }}>
          <div style={{position: 'absolute',
            top: 0,
            left: 0,
            height: '200px',
            width: '200px',
            borderRadius: '50%',
            clip: 'auto', background: '#8D2'}}>
            <div className="pie" style={{position: 'absolute',
              top: 0,
              left: 0,
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              clip: 'rect(0px, 50px, 200px, 0px)'}}>
            </div>
          </div>
        
          <div id="slice2" style={{position: 'absolute',
            top: 0,
            left: 0,
            width: '200px',
            height: '200px',
            clip: 'rect(0px, 200px, 200px, 100px)',
            transform: 'rotate(' + 90 + 'deg)'}}>
            <div className="pie" style={{position: 'absolute',
              top: 0,
              left: 0,
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              transform: 'rotate(' + Math.floor(game.sold / game.total * 360) + 'deg)',
              clip: 'rect(0px, 100px, 100px, 0px)',
              backgroundColor: '#E80'}}>
            </div>
          </div>

          <div style={{position: 'absolute',
            borderRadius: '50%',
            top: '50px',
            left: '50px',
            background: '#FFF',
            width: '100px',
            height: '100px',
            display: 'block',
            clip: 'auto'}}>
          </div>
        </div>
        <div className='status' style = {{ display: gameState === GAME_STATE.OPEN ? 'block' : 'none' }}>
          <div className='gameinfo'>
            <div className='present'>{game.sold}</div><div className='total'>/{game.total}</div>
          </div>
          <div className='timer'>
            <span>{time}s</span>
          </div>
        </div>
        <div style={{display: 'none'}} className="spin-controller">
          <div className={!spinning ? "ui button pink" : "ui button pink disabled" } onClick={handleSpin} >SPIN</div>
        </div>
        {   
          <div className={gameState === GAME_STATE.PLAY ? "spinimg" : "spinimg hide"}>
            <img style={{transform: 'rotate(' + spinAngle + 'deg)'}} src={spinimg} alt="spin"/>
          </div>
        }
        { (!status.join && gameState === GAME_STATE.OPEN) &&
          <div className="deposit-controller">
            <div className={"ui massive button pink"} onClick={handleJoin} >JOIN</div>
            <div className={"ui massive button pink"} onClick={() => {this.leaveTo('/')}} >LEAVE</div>
          </div>
        }
        { this.state.depositForm &&
          <DepositForm onDeposit={handleDeposit} 
                       onCancel={handleCancel}
                       close={this.state.animate}
                       onChange={handleChange}
                       form = {form}
                       status = {status}/>
        }
        { gameState === GAME_STATE.CLOSE && 
        <div className="winners fadeInUp">
          Winner : @{winner_name}@
        </div>
        }
        { gameState === GAME_STATE.CLOSE && 
        <div className="navigate-controller">
          <div className={"ui massive button pink" } onClick={() => {this.leaveTo('/')}} >LEAVE</div>
        </div>
        }
      </div>
    )
  }

  componentWillUnmount() {
    //reset game
    this
      .props
      .GameActions
      .gameRoomReset();

    this
      .props
      .FormActions
      .formReset();

    //disconnect socket
    console.log(gameSocket);
    if (gameSocket.getSocket()) {
        gameSocket.close();
    }
  }
}

export default withRouter(GameRoom);