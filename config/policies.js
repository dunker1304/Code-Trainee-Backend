/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  // TestController: {

  //  '*': 'isAuthenticate'
  // },

  // UserController : {
  //   '*' : 'isAuthenticate'
  // },

  ExerciseController : {
    'addWishList' : 'isAuthenticate',
    'removeWishList' : 'isAuthenticate',
    'getWishList':'isAuthenticate',
    'removeWishList' : 'isAuthenticate'
  },
  CommentController : {
    'createAComment' : 'isAuthenticate',
    'voteAComment':'isAuthenticate',
    'deleteAComment':'isAuthenticate',
    'getCommentByCommentId':'isAuthenticate'
  },
  
};
