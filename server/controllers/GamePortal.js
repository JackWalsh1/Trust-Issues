const models = require('../models');
// const helper = require('./helper.js');

const { Account } = models;

const gamePortal = (req, res) => res.render('gamePortal');

const claimTrustFund = async (req, res) => {
  const username = `${req.body.username}`;

  // check if all variables exist / if pass & pass2 match
  if (!username) {
    return res.status(400).json({ error: 'All fields required.' });
  } if (username !== req.session.account.username) {
    return res.status(403).json({ error: 'User is attempting to change someone else\'s trust fund claim status.' });
  }

  try {
    const doc = await Account.findOne({ username }).exec();
    // current date - last claim - day in milliseconds
    if (Date.now() - doc.trustFundClaim - 86400000 >= 0) {
      doc.trust += 52 * doc.premium ? 2 : 1;
      doc.trustFundClaim = Date.now();
      await doc.save();
      return res.status(200).json({ message: 'Trust fund claimed.' });
    }
    return res.status(204).json({ message: 'It hasn\'t been 24 hours since the last claim.' });
  } catch (err) {
    console.log(err);
    // 11000 = Mongo’s “duplicate entry” error
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Account does not exist.' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const makeAccountPremium = async (req, res) => {
  // get req body variables
  const username = `${req.body.username}`;
  const passphrase = `${req.body.passphrase}`;

  if (!username || !passphrase) {
    return res.status(400).json({ error: 'All fields required.' });
  } if (username !== req.session.account.username) {
    return res.status(403).json({ error: 'User is attempting to change someone else\'s premium status.' });
  } if (passphrase !== 'makeMePremium') {
    return res.status(403).json({ error: 'Incorrect passphrase for premium.' });
  }

  try {
    const doc = await Account.findOne({ username }).exec();
    if (doc.premium === false) {
      doc.premium = true;
      await doc.save();
      return res.status(200).json({ message: 'Account is now premium.' });
    }
    return res.status(204).json({ message: 'Account is already premium.' });
  } catch (err) {
    console.log(err);
    // 11000 = Mongo’s “duplicate entry” error)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Account does not exist.' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

module.exports = {
  gamePortal,
  claimTrustFund,
  makeAccountPremium,
};
