import React, { Component } from 'react';
import './DepositForm.scss';


class DepositForm extends Component {
  // state = {
  //   close : false
  // }

  // handleSubmit = () => {
  //   const { onDeposit } = this.props;
  //   this.setState({close: true});
  //   setTimeout( onDeposit, 700 );
  // }
  render () {
    const { close, onDeposit, onCancel, onChange, form, status } = this.props;
    const { amount } = form;
    const { game } = status;
    const balance = game.total - game.sold;

    return (
      <div className='deposit' style={{
              "fontWeight": "600",
              "position": "fixed",
              "left": "50%",
              "top": "50%",
              "WebkitTransform": "translate(-50%, -50%)",
              "MsTransform": "translate(-50%, -50%)",
              "transform": "translate(-50%, -50%)"
            }}>
        <div className={!close ? 'box bounceInRight' : 'box bounceInRight bounceOutLeft'} style={{
            "backgroundColor": "rgba(0, 0, 0, 0.6)",
            "border": "1px solid rgba(255, 156, 229, 0.3)",
            "padding": "35px"
          }}>
          <div className="ui massive form" >
            <div className="field">
              <label style={{color:'white'}}>Balance</label>
              <input type="text" name="balance" placeholder="Balance" disabled
                     value={balance} />
            </div>
            <div className="field">
              <label  style={{color:'white'}}>Amount</label>
              <input type="text" name="amount" placeholder="Amount" 
                     onChange = {onChange}
                     value = {amount}/>
            </div>
            <div style={{
              "display": "flex",
              "width": "100%"
              }}>
              <button
                className={`massive pink ui button `}
                type="submit" style={
                  {

                  }
                } onClick = { onDeposit }>
                Deposit
              </button>
              <button
                className={`massive pink ui button `}
                type="submit" style={
                  {
                  }
                } onClick = { onCancel }>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DepositForm