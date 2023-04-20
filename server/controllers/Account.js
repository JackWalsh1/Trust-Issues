const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  // get req body variables
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // check if all variables exist / if pass & pass2 match
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  // make sure account is accurate - if no error, leave
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username / password.' });
    }

    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
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

  try {
    // hash password, then save in database
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    // 11000 = Mongo’s “duplicate entry” error)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
};
