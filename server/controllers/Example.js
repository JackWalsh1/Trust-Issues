/*
  EXAMPLE - not for actual production
*/

const models = require('../models');

const { Example } = models;

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

  // make sure Example is accurate - if no error, leave
  return Example.authenticate(username, pass, (err, example) => {
    if (err || !example) {
      return res.status(401).json({ error: 'Wrong username / password.' });
    }

    req.session.Example = Example.toAPI(example);
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
    const hash = await Example.generateHash(pass);
    const newExample = new Example({ username, password: hash });
    await newExample.save();
    req.session.Example = Example.toAPI(newExample);
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
