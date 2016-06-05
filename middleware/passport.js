'use strict';

const Router = require('express').Router;
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

module.exports = () => {

  let router = new Router();

  const strategy = new Auth0Strategy({
    domain: 'flexhub.auth0.com',
    clientID: 'YIFJWLW0nB8bOSdctNeNBZ8ffSBD153B',
    clientSecret: 'KbZQI-wUFXkKZpqR4HulY7L1kOtB7-kK9GoG1a0aUTOy9StnkQGcxT83VkGk85Yz',
    callbackURL: '/callback',
  }, (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

  passport.use(strategy);

  // This is not a best practice, but we want to keep things simple for now
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });


  // Session and cookies middlewares to keep user logged in


  router.use(cookieParser());

  // See express session docs for information on the options: https://github.com/expressjs/session
  router.use(session({ secret: 'YOUR_SECRET_HERE', resave: false, saveUninitialized: false }));
  router.use(passport.initialize());
  router.use(passport.session());

  router.use((req, res, next) => {
    console.log('user', req.user);
    next();
  });

  router.get('/login', (req, res, next) => res.sendFile(path.resolve(__dirname, '../../client/static/login.html')))

  // Auth0 callback handler
  router.get('/callback',
    (req, res, next) => {
      console.log(req.user, req.headers, req.url, req.query);
      next();
    },
    passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
    (req, res) => {
      if (!req.user) {
        throw new Error('user null');
      }
      res.redirect('/user');
    });

  router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
    next();
  });

  router.get('/user', function (req, res) {
    res.send({
      user: req.user,
    });
  });

  return router;
}
