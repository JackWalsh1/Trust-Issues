/*
   bcrypt => encrypting passwords
   Mongoose => interacting with our mongo database.
*/
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

/* salt => extra data that gets hashed along with the password.
   saltRounds => number of times we will hash the password and salt.
*/
const saltRounds = 10;

let AccountModel = {};

/* username => unique string of alphanumeric characters
   password => hashed version of the password
   premium => if account is premium
   profileImg => binary string of profile img
   bio => user bio
   trust => amount of Trust user has
   history => history of user's past games
   createdDate => date of account creation
*/
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    required: true,
    default: false,
  },
  profileImg: {
    // https://www.youtube.com/watch?v=GyzC-30Bqfc
    type: Buffer,
    contentType: String,
    required: true,
    default: 'generic user image to find later',
  },
  bio: {
    type: String,
    required: true,
    trim: true,
    default: "This user doesn't have a bio yet!",
  },
  trust: {
    type: Number,
    required: true,
    default: 52,
  },
  trustFundClaim: {
    type: Date,
    required: true,
    default: Date(0),
  },
  history: {
    type: Array,
    required: true,
    default: ['No games yet!'],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
