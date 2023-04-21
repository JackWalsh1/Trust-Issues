// helper functions for controllers

const allParams = (paramArray, res) => {
  console.log('inside allParams');
  for (const param of paramArray) {
    console.log(param);
    if (!param || param === 'undefined') {
      console.log('inside error');
      return res.status(400).json({ error: 'All fields required.' });
    }
  }
};

const verifyUsername = (req, res, failStatusCode, change) => {
  if (req.body.username !== req.session.account.username) {
    return res.status(failStatusCode).json({ error: `User is attempting to change someone else\'s ${change}.` });
  }
};

module.exports = {
  allParams,
  verifyUsername,
};
