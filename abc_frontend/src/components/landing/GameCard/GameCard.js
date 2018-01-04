import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import './GameCard.scss';

// class GameCard extends Component {
//   render () {
//     const {imgData, header, small, gameType} = this.props;
//     console.log(this.props.path);
//     return (
//       // <Link to={'/game/'+gameType+'/id/482929'}>
//         <div className='gamecard' onClick={this.props.onClick}>
//             <img src={imgData} alt='img'/>
//             <h1>{header}</h1>
//             <h4>{small}</h4>
//             <div className="ui hover button pink">JOIN</div>
//         </div>
//       // </Link>
//     )
//   }
// }

const GameCard = ({imgData, header, small, onClick}) => (
  <div className='gamecard' onClick={onClick}>
  <img src={imgData} alt='img'/>
  <h1>{header}</h1>
  <h4>{small}</h4>
  <div className="ui hover button pink">JOIN</div>
</div>
);

export default GameCard;