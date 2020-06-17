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
  // UserController
  'get /oauth/google': 'UserController.googleAuth',
  'post /signup'  : 'UserController.signUp',
  'post /signin'  : 'UserController.signIn',
  'get /accounts/confirm-email/:secret' : 'UserController.verifyAccount',
  'get /oauth/google/callback':'UserController.googleCallback',
  'get /api/current_user' :'UserController.currentUser',

  // TestController
  'post /api/test': 'TestController.post',
  'get /api/find': 'TestController.find',

  //QuestionController
  'post /api/submissions': 'QuestionController.submitQuestion',
  'get /api/question': 'QuestionController.get'
};
