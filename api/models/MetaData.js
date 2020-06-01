/**
 * MetaData.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true, required : true },
    'question_id' : { type : 'number' , required: true},
    'name_function' : { type : 'string' , required : true },
    'param_type' : {type : 'string' , allowNull : true },
    'return_type' : { type : 'string' ,allowNull : true },
    'order' : { type : 'number' }
  },

};

