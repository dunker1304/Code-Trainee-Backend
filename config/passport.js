
const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const CONSTANTS  = require('../config/custom').custom


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: CONSTANTS.JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    if (Date.now() >= payload.exp ) {
      return done(null, false, { message : 'Token expired'});
    }
    
    //Find the user specified in token
    const user = await User.findOne({id:payload.sub}).populate('roles');
    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    //format user
    let responseUser = {
      id : user['id'],
      username : user['username'],
      displayName : user['displayName'],
      imageLink : user['imageLink'],
      dateOfBirth : user['dateOfBirth'],
      email : user['email'],
      phone : user['phone'],
      role : {
        id :  user['roles'] &&  user['roles'].length > 0 ? user['roles'][0]['id'] : '',
        name :   user['roles'] &&  user['roles'].length > 0 ? user['roles'][0]['name'] : ''
      }
    }

  
    // Otherwise, return the user
    req.user = responseUser;
    done(null, responseUser);
  } catch(error) {
    done(error, false);
  }
}));

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: CONSTANTS.CLIENT_ID,
    clientSecret: CONSTANTS.CLIENT_SECRET,
    callbackURL: '/oauth/google/callback'
  }, async (req, accessToken, refreshToken, profile, next) => {
    
       
       let data = { googleId : req , profile : profile}

       return next(null,data)
  }));

  // LOCAL STRATEGY
passport.use(new LocalStrategy({
  // or whatever you want to use
    usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password',
    passReqToCallback: true
  
}, async (req,email, password, done) => {
  try {

    let criteria = (email.indexOf('@') === -1) ? { username : email} : { email : email};

    criteria['isLoginLocal'] = 1;
    
    // Find the user given the email or username
    console.log(criteria)
    const user = await User.findOne(criteria).populate('roles', { id : req.body.role});
    console.log(user)
   
    // If not, handle it
    if (!user || (user && user['roles'] && user['roles'].length == 0)) {
      return done(null, false, {message : 'Account not exist!'});
    }
  
    // Check if the password is correct
    const isMatch = await User.isValidPassword(user,password);
  
    // If not, handle it
    if (!isMatch) {
      return done(null, false, { message : 'Password is not correct!'});
    }

    //if account not verify
    if( user.status == 0 && user.isLoginLocal == 1 ){
        return done(null ,false , { message : 'Account not verify!'})
    }

   
     //format user
     let responseUser = {
      id : user['id'],
      username : user['username'],
      displayName : user['displayName'],
      imageLink : user['imageLink'],
      dateOfBirth : user['dateOfBirth'],
      email : user['email'],
      phone : user['phone'],
      role : {
        id :  user['roles'] &&  user['roles'].length > 0 ? user['roles'][0]['id'] : '',
        name :   user['roles'] &&  user['roles'].length > 0 ? user['roles'][0]['name'] : ''
      }
    }

  
    // Otherwise, return the user
    done(null, responseUser);
  } catch(error) {
    done(error, false);
  }
}));
  