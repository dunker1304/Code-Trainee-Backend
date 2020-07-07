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
  "post /api/save-testcase": "TestCaseController.saveTestCase",
  "post /api/update-testcase": "TestCaseController.updateTestCase",
  "post /api/delete-testcase": "TestCaseController.deleteTestcase",
  "get /api/get-testcases-by-execercise": "TestCaseController.getByExercise",

  // SnippetController
  "post /api/update-or-create-sample": "SnippetController.updateOrCreateSample",
  "post /api/update-or-create-supported-lang":
    "SnippetController.updateOrCreateSupportedLanguage",

  // ProgramLanguageController
  "get /api/get-all-languages": "ProgramLanguageController.getAllByExercise",
};
