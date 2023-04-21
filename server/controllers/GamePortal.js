const models = require('../models');

const { Account } = models;

const gamePortal = (req, res) => res.render('gamePortal');

const claimTrustFund = (req, res, body) => {
  return true;
}

const makeAccountPremium = async (req, res) => {
    // get req body variables
    const username = `${req.body.username}`;
    const passphrase = `${req.body.passphrase}`;
  
    // check if all variables exist / if pass & pass2 match
    if (!username || !passphrase) {
      return res.status(400).json({ error: 'All fields required.' });
    } else if (username !== req.session.account.username) {
      return res.status(403).json({ error: 'User is attempting to change someone else\'s premium status.' });
    } else if (passphrase !== "makeMePremium") {
      return res.status(403).json({ error: 'Incorrect passphrase for premium.' });
    }

    try {
      const doc = await Account.findOne({ username }).exec();
      if (doc.isPremium === false) {
        doc.isPremium = true;
        await doc.save();
        return res.status(200).json({ message: 'Account is now premium.' });
      } else {
        return res.status(204).json({ message: 'Account is already premium.' });
      }
    } catch (err) {
    console.log(err);
    // 11000 = Mongo’s “duplicate entry” error)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Account does not exist.' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
}

module.exports = {
  gamePortal,
  claimTrustFund,
  makeAccountPremium
};