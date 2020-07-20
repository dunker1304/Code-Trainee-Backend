
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
    const user = await User.findOne({id:payload.sub});
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
  
    // Should have full user profile over here
    // console.log('profile', profile);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    // console.log(req);

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

      let email = profile.emails[0].value;
      let userLocal = await User.find({'email':email,'isLoginLocal':1})
     
      if(userLocal && userLocal.length > 0) {
        console.log("exit account register local")
        let userUpdate = await User.update({ email: email })
        .set({
          googleId : profile.id,
          displayName : profile.displayName,
          imageLink : profile.photos[0].value,
          isLoginGoogle :1,
          secret : ''
        }).fetch();

        next(null,userUpdate)

      }
      else {
        try {
          console.log('creating new account');
          // //    console.log(profile)
              let newUser = {
                'googleId' : profile.id,
                'email' : profile.emails[0].value,
                'imageLink' : profile.photos[0].value,
                'displayName' : profile.displayName,
                'isLoginGoogle' : 1,
                'username':profile.emails[0].value
              }
               // User.create(newUser);
              let user = await User.create(newUser).fetch();
              next(null,user)
        } catch (error) {
          console.log(error);
          next(null,false)
        }
       
      }
     

    }
  }));

  // LOCAL STRATEGY
passport.use(new LocalStrategy({
  // or whatever you want to use
    usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
  
}, async (email, password, done) => {
  try {

    let criteria = (email.indexOf('@') === -1) ? { username : email} : { email : email};

    criteria['isLoginLocal'] = 1;
    
    // Find the user given the email or username
    const user = await User.findOne(criteria);
    
    // If not, handle it
    if (!user) {
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
  
    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));
  