/**
 * Comment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    'id': { type: 'number' ,  autoIncrement: true, required : true },
    'text' : {type : 'string', required : true},
    'parent_id' :  { type : 'number' ,allowNull : true },
    'is_deleted' : { type : 'boolean' , defaultsTo : false },
    'like' : { type : 'number' , defaultsTo : 0 },
    'dislike' : { type : 'number' , defaultsTo : 0},
    'sender' : { type : 'number'},
    'createAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'updateAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true}
  },

};

