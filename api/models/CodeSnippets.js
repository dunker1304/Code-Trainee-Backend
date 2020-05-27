/**
 * CodeSnippets.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    'id': { type: 'string', columnName: '_id' },
    'question_id' : { type : 'number' , required : true },
    'language_id' : { type : 'number' , required : true }
  },

};

