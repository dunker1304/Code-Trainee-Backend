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
  "get /api/user/exercise":"UserController.getExerciseOfAUser",
  "post /api/user/role":"UserController.getRole",
  "get /signout":"UserController.signOut",

  //CommentController :
  "post /api/create-comment": "CommentController.createAComment",
  "post /api/create-vote-comment": "CommentController.voteAComment",
  "post /api/get-comment-question-id":
    "CommentController.getCommentByQuestionId",
  "post /api/get-comment-comment-id": "CommentController.getCommentByCommentId",
  "post /api/delete-a-comment": "CommentController.deleteAComment",

  // TestController
  "post /api/test": "TestController.post",
  "get /api/get": "TestController.get",

  // ExerciseController
  "get /api/exercise": "ExerciseController.getExerciseById",
  "post /api/submissions": "ExerciseController.submitExercise",
  "get /api/submissions/all": "ExerciseController.getAllSubmissions",
  "post /api/solution": "ExerciseController.submitSolution",
  "get /api/exercise/random": "ExerciseController.getRandom",
  "get /api/exercise/basic-info/:exerciseId":
    "ExerciseController.getBasicInfoById",
  "post /api/exercise/create": "ExerciseController.createExercise",
  "post /api/exercise/update": "ExerciseController.updateExercise",
  "get /api/exercise/owner/:ownerId": "ExerciseController.getByOwner",
  "post /api/exercise/delete": "ExerciseController.deleteExercise",
  "get /api/exercise/approve": "ExerciseController.getExerciseNeedApproval",
  "post /api/exercise/approve/update": "ExerciseController.updateExerciseNeedApproval",
  "get /api/exercise/vote": "ExerciseController.getVoteExercise",
  'post /api/exercise/react': 'ExerciseController.reactExercise',

  //quynhkt-exerciseController
  "post /api/search-exercise": "ExerciseController.searchExercise",
  "post /api/add-wishList": "ExerciseController.addWishList",
  "get /api/get-tag": "ExerciseController.getTag",
  "post /api/remove-wishList": "ExerciseController.removeWishList",
  "get /api/get-activity-calendar/:userId":
    "ExerciseController.getSubmmitionByUserId",
  "get /api/get-most-recent-sub/:userId":
    "ExerciseController.getMostRecentSubmission",
  "post /api/add-type-wish-list": "ExerciseController.addTypeWishList",
  "get /api/wish-list/:type": "ExerciseController.getWishListByType",
  "get /api/wish-list": "ExerciseController.getWishList",
  "get /api/all-submission": "ExerciseController.getAllSubmission",
  "get /api/submission/:subId" : "ExerciseController.getSubmissionById",

  // TestcaseController
  "get /api/testcase": "TestCaseController.getById",
  "post /api/testcase/create": "TestCaseController.createTestCase",
  "post /api/testcase/update": "TestCaseController.updateTestCase",
  "post /api/testcase/delete": "TestCaseController.deleteTestcase",
  "get /api/testcase/exercise/:exerciseId": "TestCaseController.getByExercise",

  // SnippetController
  "post /api/snippet/update":
    "SnippetController.updateOrCreateSnippet",
  "get /api/snippet-code": "SnippetController.getSnippetCode",

  // ProgramLanguageController
  "get /api/language/exercise/:exerciseId": "ProgramLanguageController.getAllByExerciseId",
  "get /api/language/all": "ProgramLanguageController.getAll",

  // TagController
  "get /api/tags/exercise/:exerciseId": "TagController.getTagsByExerciseId",
  "get /api/tags/all": "TagController.getAllTags",

  // AdminController
  "post /api/admin/get-user-by-role": "AdminController.getUserByRole",
  "post /api/admin/get-user-by-id": "AdminController.getUserById",
  "post /api/admin/edit-an-account": "AdminController.editAnAccount",
  "post /api/admin/create-an-account": "AdminController.createAnAccount",
  "post /api/admin/search-fuzzy-account":
    "AdminController.getUserByRoleWithKeySearch",
};
