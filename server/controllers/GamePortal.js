const models = require('../models');

const { Account } = models;

const gamePortal = (req, res) => res.render('app');

const claimTrustFund = (req, res, body) => {
  return true;
}

const makeAccountPremium = (req, res, body) => {
  return true;
}

module.exports = {
  gamePortal,
  claimTrustFund,
  makeAccountPremium
};