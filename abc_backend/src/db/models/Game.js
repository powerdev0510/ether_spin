import mongoose, { Schema } from 'mongoose';
import User from './User';
// import cache from './../helpers/cache';
import TYPE from 'engine/gameTypes';
import STATE from 'engine/gameStates';

const UserDeposit = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User},
  username: { type: String, default: '' },
  deposit: { type: Number, default: 0 },
  transId: { type: Schema.Types.ObjectId, default: null},
  date: { type: Date, default: Date.now },
});

const MAX_LIMIT = [2, 10, 100, 10000, 1000000];

const Game = new Schema({
  type: { type: Number, default: 0 },
  depositList: [UserDeposit],
  total: Number,
  sold: { type: Number, default: 0 },
  state: { type: Number, min:0, max:2, default: 0},
  tickets: [Schema.Types.ObjectId],
  winners: [Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

Game.statics.create = async function(type) {
  const total = MAX_LIMIT[type];
  const game = new this({
    type,
    total
  });

  return game.save();
};

Game.statics.findOpenGameByType = function(type) {
  return this.findOne({ type, state: STATE.OPEN }).exec();
};

Game.statics.updateByDeposit = function(gameObj) {
  const {_id, users, usernames, deposits, sold, tickets} = gameObj;

  const depositList = users.map(user => ({
    userId: user,
    username: usernames[user],
    deposit: deposits[user]
  }));

  this.findByIdAndUpdate(_id, {
    $set: {
      users,
      depositList,
      sold,
      tickets
    }
  }).exec();
  // this.update({
  //   $set: {
  //     users,
  //     total,
  //     tickets
  //   }
  // }).exec();
};

Game.statics.updateState = function(gameObj) {
  const {_id, state, winners} = gameObj;

  this.findByIdAndUpdate(_id, {
    $set: {
      state,
      winners,
      updatedAt : new Date()
    }
  }).exec();
};

Game.statics.findById = function(_id){
  return this.findOne({ _id }).exec();
}

module.exports = mongoose.model('Game', Game);