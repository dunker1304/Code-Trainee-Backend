/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true, required : true },
    'username' : { type : 'string'  },
    'displayname' : { type : 'string' },
    'email' : { type : 'string' , required : true },
    'DOB' : {type:'ref', columnType: 'datetime' },
    'password' : { type : 'string' },
    'phone' : { type : 'string'  },
    'is_deleted': { type : 'boolean'} ,
    'createAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'updateAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true}
  },

};

