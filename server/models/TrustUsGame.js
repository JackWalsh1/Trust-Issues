// Mongoose => interacting with our mongo database.
const mongoose = require('mongoose');

let TrustUsGameModel = {};

/*
  complete => is the game complete?
  gameNumber => what # game it is - essentially an ID
  startDate => when the game started - should be 6 PM
  potMultipliers => game's 4 pot multipliers
  potTotals => game's 4 pot totals
  playerSubmissions => game's player's submissions for endgame submissions
  playerClaims => game's player's claims - can be lies
*/
const TrustUsGameSchema = new mongoose.Schema({
  gameNumber: {
    type: Number,
    default: 0,
    required: true,
    unique: true,
  },
  complete: {
    type: Boolean,
    default: false,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  potMultipliers: {
    type: Array,
    required: true,
  },
  potTotals: {
    type: Array,
    default: [0, 0, 0, 0],
    required: true,
  },
  playerSubmissions: {
    type: Array,
    default: [],
    required: true,
  },
  playerClaims: {
    type: Array,
    default: [],
    required: true,
  },
});

// Converts a doc to something we can store in redis later on.
TrustUsGameSchema.statics.toAPI = (doc) => ({
  startDate: doc.startDate,
});

// done in onload - if next 6 PM EST from game has passed, complete game + address scoring
TrustUsGameSchema.statics.isGameComplete = (startDate) => {
  const currentDate = Date.now();
  let nextDay;
  nextDay.setUTCDate(startDate.getUTCDate() + 1);
  // if currentDate is past 6 PM and it's at least the next day
  return (currentDate.getHours() >= 18 && (currentDate > nextDay));
};

TrustUsGameModel = mongoose.model('TrustUsGame', TrustUsGameSchema);
module.exports = TrustUsGameModel;
