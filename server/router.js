const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/accountPage', mid.requiresSecure, mid.requiresLogin, controllers.AccountPage.accountPage);
  app.post('/updateBio', mid.requiresSecure, mid.requiresLogin, controllers.AccountPage.updateBio);

  app.get('/gamePortal', mid.requiresSecure, mid.requiresLogin, controllers.GamePortal.gamePortal);
  app.post('/claimTrustFund', mid.requiresSecure, mid.requiresLogin, controllers.GamePortal.claimTrustFund);
  app.post('/makeAccountPremium', mid.requiresSecure, mid.requiresLogin, controllers.GamePortal.makeAccountPremium);

  app.get('/trustUs', mid.requiresSecure, mid.requiresLogin, controllers.TrustUs.trustUsPage);
  app.get('/checkForActiveGame', mid.requiresSecure, controllers.TrustUs.checkForActiveGame);
  app.post('/submitPotValues', mid.requiresSecure, mid.requiresLogin, controllers.TrustUs.submitPotValues);
  app.post('/claimPotValues', mid.requiresSecure, mid.requiresLogin, controllers.TrustUs.claimPotValues);

  // app.get('/trustMe', mid.requiresSecure, mid.requiresLogin, mid.accessibleTrustMe, controllers.TrustMe.trustMePage);

  app.get('/logout', controllers.Account.logout);

  app.get('/', controllers.Account.loginPage);
};

module.exports = router;
