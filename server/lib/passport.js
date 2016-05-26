'use strict';

const Router = require('express').Router;
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

let router = new Router();

const strategy = new Auth0Strategy({
    domain:       'flexhub.auth0.com',
    clientID:     '9cqVEyffPMJwkBOvFG0WykPtf1NZBez3',
    clientSecret: 'nVvWiHWWveGceO9Z_jLzpIwRobQ-0WT0HJJsVjFGUre9shEbfkLtj4pbZA9bm5rB',
    callbackURL:  '/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Session and cookies middlewares to keep user logged in


router.use(cookieParser());
// See express session docs for information on the options: https://github.com/expressjs/session
router.use(session({ secret: 'YOUR_SECRET_HERE', resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());



// Auth0 callback handler
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect('/user');
  });

module.exports = router;
