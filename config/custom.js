/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
  CLIENT_ID :'1034737051172-tt6rkd713lmdub59e7qakoi3o5o0b15s.apps.googleusercontent.com',
  CLIENT_SECRET : 'BVE0XLGOpyCFK77QgK4B1wx0',
  JWT_SECRET: 'codetraineeauthentication',
  DOMAIN_JUDGE : 'https://api.codetrainee.codes',
  RAPIDAPI_KEY : '42413616ffmshacd96f052fdb599p114173jsn116e7210cfd4',
  STATUS_SUBMIT : {
    'IN_QUEUE' : 1,
    'PROCESSING' : 2,
    'ACCEPTED' : 3,
    'WRONG_ANSWER' : 4,
    'TIME_LIMIT' : 5,
    'COMPLILATION_ERROR' : 6,
    'RUNTIME_ERROR_(SIGSEGV)' : 7,
    'RUNTIME_ERROR_(SIGXFSZ)' : 8,
    'RUNTIME_ERROR_(SIGFPE)' : 9,
    'RUNTIME_ERROR_(SIGABRT)' : 10,
    'RUNTIME_ERROR_(NZEC)' : 11,
    'RUNTIME_ERROR_(OTHER)' : 12,
    'INTERNAL_ERROR' : 13,
    'EXEC_FORMAT_ERROR' : 14,
  },
  ERROR_STATUS : [6,7,8,9,10,11,12,13,14]

};
