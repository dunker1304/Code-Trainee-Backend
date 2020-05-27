/**
 * Question.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'string', columnName: '_id' },
    'title' : { type : 'string' , required : true },
    'text' : { type : 'string' , required : true },
    'points' : { type : 'number' , required : true },
    'level' : { type : 'string' ,  defaultsTo : 'easy'},
    'isDelete' : { type : 'boolean' , defaultsTo : false },
    'status' : { type : 'number' , defaultsTo : 0 } ,// 0 : pending , 1 : approved
    'otherRequire' : { type : 'string' , allowNull: true } ,
    'limitCodeCharactor' : { type : 'number' , allowNull : true },
    'like' : { type : 'number' , defaultsTo : 0 },
    'dislike' : { type : 'number' , defaultsTo : 0},
    'created' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'updated' : {type:'ref', columnType: 'datetime', autoCreatedAt: true}

  
  },

};

 