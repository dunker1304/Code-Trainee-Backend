/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcryptjs');
module.exports = {

  attributes: {
    'id': { type: 'number' ,  autoIncrement: true},
    'username' : { type : 'string'  },
    'displayname' : { type : 'string' },
    'email' : { type : 'string' , required : true },
    'DOB' : {type:'ref', columnType: 'datetime' },
    'password' : { type : 'string',allowNull : true },
    'phone' : { type : 'string'  },
    'isDeleted': { type : 'boolean'} ,
    'createAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'updateAt' : {type:'ref', columnType: 'datetime', autoCreatedAt: true},
    'googleId' : { type : 'string' },
    'isLoginLocal' : { type : 'number'},
    'isGoogleLogin': { type : 'number'}
  },
  customToJSON: function() {
    return _.omit(this, ['password'])
 },
  beforeCreate: async function(user, cb){
    try {
      if(user.password) {
         // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(user.password, salt);
      // Re-assign hashed version over original, plain text password
      user.password = passwordHash;
      cb();
      }
      else 
        cb();
    } catch (error) {
      cb(error);
    }
 },
 beforeUpdate :  async function(user, cb){
  try {
    if(user.password) {
       // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(user.password, salt);
    // Re-assign hashed version over original, plain text password
    user.password = passwordHash;
    cb();
    }
  } catch (error) {
    cb(error);
  }
},
isValidPassword: async function(user,newPassword){
  try {
    return await bcrypt.compare(newPassword, user.password);
  } catch (error) {
    throw new Error(error);
  }
}

};

