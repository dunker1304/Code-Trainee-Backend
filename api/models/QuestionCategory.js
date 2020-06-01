/**
 * QuestionCategory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true, required : true },
    'category_id' : { type: 'number'  },
    'question_id' : { type: 'number'  },
    
  },

};

