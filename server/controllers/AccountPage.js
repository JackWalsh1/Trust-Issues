const models = require('../models');

const accountPage = (req, res) => res.render('app');

const updateBio = (req, res, body) => {
  return true;
}

module.exports = {
  accountPage,
  updateBio,
};
