import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import './GameCard.scss';

class GameCard extends Component {
  render () {
    const {imgData, header, small} = this.props;
    return (
      <Link to='/game'>
        <div className='gamecard'>
            <img src={imgData} alt='img'/>
            <h1>{header}</h1>
            <h4>{small}</h4>
            <div className="ui hover button pink">JOIN</div>
        </div>
      </Link>
    )
  }
}

export default GameCard;