/**
 * TestCase.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true, required : true }, 
    'question_id' :  { type : 'number' , required: true}, 
    'is_hidden' : { type : 'number' },
    'input_data' : { type : 'string'  },
    'outputData' : { type : 'string'  },
    'execute_time_limit' :  { type : 'number'  },
  
  },

};

