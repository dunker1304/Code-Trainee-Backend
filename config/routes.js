/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'get /api/test': 'TestController.post',
  'get /oauth/google': 'UserController.googleAuth',
  'post /signup'  : 'UserController.signUp',
  'post /signin'  : 'UserController.signIn',
  'get /api/test': 'TestController.get',
  'get /api/find': 'TestController.find',
  'get /accounts/confirm-email/:secret' : 'UserController.verifyAccount',
  'get /oauth/google/callback':'UserController.googleCallback',

};
