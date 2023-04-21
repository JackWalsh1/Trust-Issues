const models = require('../models');

const { Account } = models;

const trustUsPage = (req, res) => res.render('trustUsPage');

const submitPotValues = (req, res, body) => {
  return true;
}

const claimPotValues = (req, res, body) => {
  return true;
}

module.exports = {
  trustUsPage,
  submitPotValues,
  claimPotValues,
}
