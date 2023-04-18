/* NOT FOR ACTUAL PRODUCTION - just an example for models
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

/* Helper function for authenticating a password against one already in the
   database. Essentially when a user logs in, we need to verify that the password
   they entered matches the one in the database. Since the database stores hashed
   passwords, we need to get the hash they have stored. We then pass the given password
   and hashed password to bcrypt's compare function. The compare function hashes the
   given password the same number of times as the stored password and compares the result.
*/
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
