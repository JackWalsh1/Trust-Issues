const models = require('../models');

const { Account } = models;

const accountPage = (req, res) => res.render('accountPage');

const updateBio = async (req, res) => {
  // get req body variables
  const username = `${req.body.username}`;
  const bio = `${req.body.bio}`;

  // check if all variables exist / if pass & pass2 match
  if (!username || !bio) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  if (username !== req.session.account.username) {
    return res.status(403).json({ error: 'User is attempting to change someone else\'s bio.' });
  }

  try {
    const doc = await Account.findOne({ username }).exec();
    doc.bio = bio;
    await doc.save();
    return res.status(200).json({ message: 'Bio updated.' });
  } catch (err) {
    console.log(err);
    // 11000 = Mongo’s “duplicate entry” error)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Account does not exist.' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const username = `${req.query.username}`;
    const doc = await Account.findOne({ username }).exec();
    if (!doc) {
      return res.status(400).json({ error: 'Username does not exist.' });
    }
    return res.status(200).json({
      username: doc.username, 
      bio: doc.bio, 
      trust: doc.trust, 
      history: doc.history,
      premium: doc.premium});
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Username is required.' });
  }
};

module.exports = {
  accountPage,
  updateBio,
  getUserInfo
}
