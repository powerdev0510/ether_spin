import React, { Component } from 'react'
import './GameRoom.scss';
import spinimg from 'static/assets/spin.png';

let timerId = null;

class GameRoom extends Component {

  state={
    presentNumber:0,
    time: 100,
    spinning: false,
    spinAngle: 0
  }

  componentDidMount() {
    console.log('did mount');
    
    if(timerId)
      clearInterval(timerId);

    timerId = setInterval(() => {
      console.log('timer'+this.state.time);
      if(this.state.time === 0) {
        if(timerId){
          clearInterval(timerId);
          return;
        }
      }
      this.setState({time: this.state.time-1});
    }, 1000);
  }

  componentDidUnount() {
    if(timerId)
      clearInterval(timerId);
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

  render () {
    const total = [10, 50, 100];
    // const i = Math.floor(Math.random() * 100) % 3;
    const i = 2;
    const presentNumber = Math.floor(Math.random() * total[i]);
    const { time, spinning, spinAngle } = this.state;
    const angle = [216, 90, 306, 36, 342, 14.4, 356.4, 3.6].map((ang, i) => (Math.floor(Math.random() * (i+1) * 360)));

    const { handleSpin } = this;
    return (
      <div>
        <div className='pie-chart'>
            <div style={{position: 'absolute',
              top: 0,
              left: 0,
              height: '200px',
              width: '200px',
              borderRadius: '50%',
              clip: 'auto', background: '#8D2'}}>
              <div class="pie" style={{position: 'absolute',
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
              transform: 'rotate(' + angle[0] + 'deg)'}}>
              <div class="pie" style={{position: 'absolute',
                top: 0,
                left: 0,
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                transform: 'rotate(' + angle[1] + 'deg)',
                clip: 'rect(0px, 100px, 100px, 0px)',
                backgroundColor: '#E80'}}>
              </div>
            </div>
            <div id="slice3" style={{position: 'absolute',
              top: 0,
              left: 0,
              width: '200px',
              height: '200px',
              clip: 'rect(0px, 200px, 200px, 100px)',
              transform: 'rotate('+angle[2] +'deg)'}}>
              <div class="pie" style={{position: 'absolute',
                top: 0,
                left: 0,
                width: '200px',
                height:'200px',
                borderRadius: '50%',
                backgroundColor: '#07E',
                transform: 'rotate('+angle[3]+'deg)',
                clip: 'rect(0px, 100px, 100px, 0px)'}}>
              </div>
            </div>
            <div id="slice4" style={{position: 'absolute',
              top: 0,
              left: 0,
              width: '200px',
              height: '200px',
              clip: 'rect(0px, 200px, 200px, 100px)',
              transform: 'rotate('+angle[4]+'deg)'}}>
              <div class="pie" style={{position: 'absolute',
                top: 0,
                left: 0,
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                backgroundColor: '#E5E',
                transform: 'rotate('+angle[5]+'deg)',
                clip: 'rect(0px, 100px, 100px, 0px)'}}></div>
            </div>
            <div id="slice5" style={{position: 'absolute',
              top: 0,
              left: 0,
              width: '200px',
              height: '200px',
              clip: 'rect(0px, 200px, 200px, 100px)',
              transform: 'rotate('+angle[6]+'deg)'}}>
            <div class="pie" style={{position: 'absolute',
              top: 0,
              left: 0,
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: '#90D',
              transform: 'rotate('+angle[7]+'deg)',
              clip: 'rect(0px, 100px, 100px, 0px)'}}></div>
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
        <div className='status'>
          <div className='gameinfo'>
            <div className='present'>{presentNumber}</div><div className='total'>/{total[i]}</div>
          </div>
          <div className='timer'>
            <span>{time}s</span>
          </div>
        </div>
        <div className="spin-controller">
          <div className={!spinning ? "ui button pink" : "ui button pink disabled" } onClick={handleSpin} >SPIN</div>
        </div>
        <div className="spinimg">
          <img style={{transform: 'rotate('+spinAngle+'deg)'}} src={spinimg} alt="spin"/>
        </div>
      </div>
    )
  }
}

export default GameRoom