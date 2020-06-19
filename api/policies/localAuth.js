/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to require an authenticated user, or else return 401 status
 *                 Looks for an Authorization header a valid JWT token
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
const passport = require('passport');
const passportLocal = passport.authenticate('localAuth', {session : false})
module.exports = async function(req, res, next) {
    passportLocal(req,res,next)
   //next()
};
