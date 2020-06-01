/**
 * Question.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true, required : true },
    'title' : { type : 'string' , required : true },
    'text' : { type : 'string' , required : true },
    'points' : { type : 'number' , required : true },
    'level' : { type : 'string' ,  defaultsTo : 'easy'},
    'is_deleted' : { type : 'number'  },
    'status' : { type : 'number' , defaultsTo : 0 } ,// 0 : pending , 1 : approved
    'other_require' : { type : 'string' , allowNull: true } ,
    'limit_code_charactor' : { type : 'number' , allowNull : true },
    'like' : { type : 'number' , defaultsTo : 0 },
    'dislike' : { type : 'number' , defaultsTo : 0},
    'createAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'updateAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'creator' : { type : 'number'},
    

  
  },

};

 