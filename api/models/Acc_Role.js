/**
 * Acc_Role.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true, required : true },
    'user_id' : { type : 'number' , required: true },
    'role_id' : { type : 'number' , required: true },
  },

};

