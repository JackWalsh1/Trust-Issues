// helper functions for controllers

const allParams = (paramArray, res) => {
  console.log('inside allParams');
  let param;
  for (let i = 0; i < paramArray.length; i++) {
    param = paramArray[i];
    console.log(param);
    if (!param || param === 'undefined') {
      console.log('inside error');
      return res.status(400).json({ error: 'All fields required.' });
    }
  }
  return true;
};

const verifyUsername = (req, res, failStatusCode, change) => (
  req.body.username !== req.session.account.username
    ? res.status(failStatusCode).json({ error: `User is attempting to change someone else's ${change}.` })
    : true
);

module.exports = {
  allParams,
  verifyUsername,
};
