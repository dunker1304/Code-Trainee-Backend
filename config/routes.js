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
  "get /oauth/google": "UserController.googleAuth",
  "post /signup": "UserController.signUp",
  "post /signin": "UserController.signIn",
  "get /accounts/confirm-email/:secret": "UserController.verifyAccount",
  "get /oauth/google/callback": "UserController.googleCallback",
  "get /api/current_user": "UserController.currentUser",
  "get /api/profile/:userId" : "UserController.getUserById",

  // TestController
  'post /api/test': 'TestController.post',
  'get /api/find': 'TestController.get',

  //QuestionController
  // 'post /api/submissions': 'QuestionController.submitQuestion',
  // 'get /api/question': 'QuestionController.get',
  // 'post /api/search-question' : 'QuestionController.searchQuestion',
  // 'post /api/add-wishList'  : 'QuestionController.addWishList',
  // 'get /api/get-category'  : 'QuestionController.getCategory',
  // 'post /api/remove-wishList' : 'QuestionController.removeWishList',

  //CommentController : 
  'post /api/create-comment' : 'CommentController.createAComment',
  'post /api/create-vote-comment' : 'CommentController.voteAComment',
  'post /api/get-comment-question-id' : 'CommentController.getCommentByQuestionId',
  'post /api/get-comment-comment-id' : 'CommentController.getCommentByCommentId',
  'post /api/delete-a-comment' : 'CommentController.deleteAComment',
 

  // ExerciseController
  "post /api/submissions": "ExerciseController.submitExercise",
  "get /api/exercise": "ExerciseController.getExerciseById",
  'get /api/exercise/random': 'ExerciseController.getRandom',
  "post /api/save-exercise": "ExerciseController.saveExercise",
  "post /api/update-exercise": "ExerciseController.updateExercise",
  'post /api/search-exercise' : 'ExerciseController.searchExercise',
  'post /api/add-wishList'  : 'ExerciseController.addWishList',
  'get /api/get-tag'  : 'ExerciseController.getTag',
  'post /api/remove-wishList' : 'ExerciseController.removeWishList',
  'get /api/get-activity-calendar/:userId' : 'ExerciseController.getSubmmitionByUserId',
  'get /api/get-most-recent-sub/:userId': 'ExerciseController.getMostRecentSubmission',
  'post /api/add-type-wish-list':'ExerciseController.addTypeWishList',
  'get /api/wish-list/:type':'ExerciseController.getWishListByType',
  'get /api/type-wish-list' : 'ExerciseController.getTypeWishList',

  
  // TestcaseController
  "get /api/testcase": "TestCaseController.getById",
  "post /api/save-testcase": "TestCaseController.saveTestCase",
  "post /api/update-tescase": "TestCaseController.updateTestCase"
};
