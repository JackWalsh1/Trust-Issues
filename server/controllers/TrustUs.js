const _ = require('underscore');
const models = require('../models');

const { TrustUsGame } = models;

const trustUsPage = (res) => res.render('login');

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
      gameData.potMultipliers = [
        _.random(200, 300) / 100.0,
        _.random(100, 200) / 100.0,
        _.random(50, 150) / 100.0,
        _.random(0, 100) / 100.0,
      ];
      sumOfPots = gameData.potMultipliers.reduce((a, b) => a + b, 0);
      console.log(sumOfPots);
    } while (sumOfPots < 6);

    console.log(gameData.potMultipliers);
    console.log(sumOfPots);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }

  return res.status(500).json({ error: 'Fell out of try/catch' });
};

const checkForActiveGame = async (res) => {
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

  return res.status(500).json({ error: 'Fallen out of try/catch.' });
};

const submitPotValues = (req, res) => {
  // get req body variables
  const username = `${req.body.username}`;
  const potValues = `${req.body.potValues}`;
  // check if all variables exist / if pass & pass2 match
  if (!username || potValues.length !== 4) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  if (potValues.reduce((a, b) => a + b, 0) !== 50) {
    return res.status(400).json({ error: 'Pot values must sum to 50.' });
  }

  return true;
};

const claimPotValues = (req, res) => {
  // get req body variables
  const username = `${req.body.username}`;
  const potClaims = `${req.body.potClaims}`;
  // check if all variables exist / if pass & pass2 match
  if (!username || potClaims.length !== 4) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  if (potClaims.reduce((a, b) => a + b, 0) !== 50) {
    return res.status(400).json({ error: 'Pot values must sum to 50.' });
  }

  return true;
};

const resolveGame = () => true;

module.exports = {
  trustUsPage,
  checkForActiveGame,
  submitPotValues,
  claimPotValues,
  resolveGame,
};
