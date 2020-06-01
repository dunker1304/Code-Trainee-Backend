/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const passport = require('passport');
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
  
   googleAuth : function(passportGoogle ,req,res){
     x = 1;
    return "oke"
   }
};

