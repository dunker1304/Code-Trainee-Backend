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
const passportGoogle = passport.authenticate('googleToken', {session : false})
module.exports = async function(req, res, next) {
   passportGoogle(req,res)
   next()
};
