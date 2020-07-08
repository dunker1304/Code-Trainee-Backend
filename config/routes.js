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

  // TestController
  "post /api/test": "TestController.post",
  "get /api/find": "TestController.find",

  // ExerciseController
  "post /api/submissions": "ExerciseController.submitExercise",
  "get /api/exercise": "ExerciseController.getExerciseById",
  "get /api/exercise/random": "ExerciseController.getRandom",
  "get /api/exercise/basic-info": "ExerciseController.getBasicInfoById",
  "post /api/exercise/create": "ExerciseController.createExercise",
  "post /api/exercise/update": "ExerciseController.updateExercise",

  // TestcaseController
  "get /api/testcase": "TestCaseController.getById",
  "post /api/testcase/create": "TestCaseController.createTestCase",
  "post /api/testcase/update": "TestCaseController.updateTestCase",
  "post /api/testcase/delete": "TestCaseController.deleteTestcase",
  "get /api/testcase/get-by-exercise": "TestCaseController.getByExercise",

  // SnippetController
  "post /api/snippet/sample/update": "SnippetController.updateOrCreateSample",
  "post /api/snippet/supported-language/update":
    "SnippetController.updateOrCreateSupportedLanguage",

  // ProgramLanguageController
  "get /api/program-language/all": "ProgramLanguageController.getAllByExercise",
};
