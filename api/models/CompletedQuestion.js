/**
 * CompletedQuestion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true, required : true }, 
    'user_id' : { type : 'number' , required : true },
    'question_id' :  { type : 'number' , required : true },
    'time_needed' :  { type : 'number' , required : true },
    'answer' : { type : 'string' , required : true },
    'memory_needed' : { type : 'number' , allowNull : true },
    'program_language' : { type : 'number' , required : true},
    'is_finish' : { type : 'boolean', defaultsTo : false },
    'createAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'updateAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true}

  },

};

