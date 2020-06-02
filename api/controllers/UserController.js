/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const passport = require('passport');
const JWT  = require('jsonwebtoken');
const passportGoogle = passport.authenticate('googleToken', {session : false})
const CONSTANTS  = require('../../config/custom').custom;
signToken = user => {
    return JWT.sign({
      iss: 'CodeTrainee',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, CONSTANTS.JWT_SECRET);
  }
module.exports = {
  
   googleAuth : async function(req,res){
      let token = await signToken(req.user)
      res.cookie('access_token', token, {
        httpOnly: true
      });
      res.status(200).json({ success: true });
   },

   signUp : async function( req, res) {

    // validate req 
    let data = req.body 
    if(!data || !data.email || !data.password) {
      res.status(200).json({success : false , message : 'Email or password invalid'});
    }

    //process signup
    // Check if there is a user with the same email
    let user = await User.findOne({'email' : data.email , 'isLoginLocal' : 1})

    if(user) {
       return res.status(403).json({success : 'false' ,  message : 'email already exist!'})
    }

     // Is there a Google account with the same email?
     let googleUser = await User.findOne({'email' : data.email , 'isGoogleLogin' : 1});
     if(googleUser) {

       await User.update({'email':data.email}).set({
         'isLoginLocal' : 1,
         'password': data.password
      })

      // Generate the token
      const token = await signToken(googleUser);
      // Respond with token
      res.cookie('access_token', token, {
        httpOnly: true
      });
      res.status(200).json({ success: true });

     }
     else {
        // Create a new user
          const newUser = {
            'email' : data.email ,
            'password': data.password,
            'isLoginLocal' : 1,
          }

          await User.create(newUser);

          // Generate the token
          const token = await signToken(newUser);
          // Send a cookie containing JWT
          res.cookie('access_token', token, {
            httpOnly: true
          });
          res.status(200).json({ success: true });


     }

   
   },

   signIn: async function ( req, res) {
      // Generate token
    const token = await signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
      
   }
};

