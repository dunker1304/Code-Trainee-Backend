
const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const CONSTANTS  = require('../config/custom').custom

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: CONSTANTS.CLIENT_ID,
    clientSecret: CONSTANTS.CLIENT_SECRET,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, next) => {
    try {
      // Could get accessed in two ways:
      // 1) When registering for the first time
      // 2) When linking account to the existing one
  
      // Should have full user profile over here
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      return next()
           
    } catch(error) {
      next(error, false, error.message);
    }
  }));
  