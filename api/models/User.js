/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'string', columnName: '_id' },
    'username' : { type : 'string' , required : true , unique : true },
    'displayName' : { type : 'string' , required : true },
    'email' : { type : 'string' , required : true },
    'DOB' : {type:'ref', columnType: 'datetime' },
    'password' : { type : 'string' , required : true },
    'phone' : { type : 'string' , required : true },
    'isDeleted': { type : 'boolean' , defaultsTo : false} ,
    'created' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'updated' : {type:'ref', columnType: 'datetime', autoCreatedAt: true}
  },

};

