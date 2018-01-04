import mongoose from 'mongoose';
import Game from './Game';
import User from './User';

require('mongoose-double')(mongoose);

const { Schema } = mongoose;

const TRANS_SUCCESS = 0x00;
const TRANS_BAL_NOT_ENOUGH = 0x01;
const TRANS_FAIL = 0xFF;

const Transaction = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User },
  amount: Schema.Types.Double,
  gameId: { type: Schema.Types.ObjectId, ref: Game },
  cc: { type:Number, default: TRANS_SUCCESS },
  createdAt: { type: Date, default: Date.now },
});

Transaction.statics.create = async function(userId, gameId, amount) {
  const game = new this({
    userId, gameId, amount
  });

  return game.save();
}


module.exports = mongoose.model('Transaction', Transaction);