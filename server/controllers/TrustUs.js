const _ = require('underscore');
const models = require('../models');

const { Account, TrustUsGame } = models;

const trustUsPage = (req, res) => res.render('login');

const checkForActiveGame = async (req, res) => {
  try {
    const query = { complete: false };
    const docs = await TrustUsGame.find(query).lean().exec();
    if (!docs) {
      console.log('no active game');
      createNewTrustUsGame(res);
    } else {
      return res.status(200).json({ message: 'Game exists.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const createNewTrustUsGame = async (res) => {
  const gameData = {
    gameNumber: 0,
    potMultipliers: [0, 0, 0, 0],
  };

  let sumOfPots;

  try {
    const lastGame = await TrustUsGame.find().sort('-gameNumber').lean().limit(1)
      .exec();
    gameData.gameNumber = lastGame ? lastGame.gameNumber + 1 : 1;

    do {
      potMultipliers = [
        _.random(200, 300) / 100.0,
        _.random(100, 200) / 100.0,
        _.random(50, 150) / 100.0,
        _.random(0, 100) / 100.0,
      ];
      sumOfPots = potMultipliers.reduce((a, b) => a + b, 0);
      console.log(sumOfPots);
    } while (sumOfPots < 6);

    console.log(potMultipliers);
    console.log(sumOfPots);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const submitPotValues = (req, res, body) => {
  // get req body variables
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // check if all variables exist / if pass & pass2 match
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }
};

const claimPotValues = (req, res, body) => true;

module.exports = {
  trustUsPage,
  checkForActiveGame,
  submitPotValues,
  claimPotValues,
};
