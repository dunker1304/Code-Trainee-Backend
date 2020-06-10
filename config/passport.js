
const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const CONSTANTS  = require('../config/custom').custom

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
}

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: CONSTANTS.JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    // Find the user specified in token
    console.log("đi vao đay")
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    req.user = user;
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: CONSTANTS.CLIENT_ID,
    clientSecret: CONSTANTS.CLIENT_SECRET,
    callbackURL: '/oauth/google/callback'
  }, async (req, accessToken, refreshToken, profile, next) => {
     // Could get accessed in two ways:
    // 1) When registering for the first time
    // 2) When linking account to the existing one

    // Should have full user profile over here
    // console.log('profile', profile);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    console.log('req', accessToken);

    // req.user.methods.push('google')
    //   req.user.google = {
    //     id: profile.id,
    //     email: profile.emails[0].value
    //   }
    //   await req.user.save()
    //   return done(null, req.user);

    //   await User.find({'id': '1'}, function(error, user) {
    //     return next(error, user);
    // });
    if(req.user) {
      console.log("user oke");
    }

    let existUser = await User.findOne({'googleId' : profile.id})
    if(existUser) {
      console.log('user has already exitss');
      next(null,existUser)
    }
    else {
      console.log('creating new account');
      let user = {
        'googleId' : profile.id,
        'email' : profile.emails[0].value,
        'imageLink' : profile.photos[0].value,
        'displayName' : profile.displayName,
        'isLoginGoogle' : 1
      }
      await User.create(user);
      next(null,user)

    }
  }));

  // LOCAL STRATEGY
passport.use(new LocalStrategy({
 // usernameField: 'email'
}, async (email, password, done) => {
  try {

    let criteria = (email.indexOf('@') === -1) ? { username : email} : { email : email};

    criteria['isLoginLocal'] = 1;
    
    // Find the user given the email or username
    const user = await User.findOne(criteria);
    
    // If not, handle it
    if (!user) {
      return done(null, false);
    }
  
    // Check if the password is correct
    const isMatch = await User.isValidPassword(user,password);
  
    // If not, handle it
    if (!isMatch) {
      return done(null, false);
    }

    //if account not verify
    console.log(user)
    if( user.status == 0 && user.isLoginLocal == 1 ){
        return done(null ,false , { message : 'Account not verify!'})
    }
  
    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));
  