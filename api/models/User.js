/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcryptjs');
module.exports = {
  tableName: "User",
  attributes: {
    username: { type: "string", unique: true },
    password: { type: "string" },
    displayName: { type: "string", columnName: "display_name" },
    email: { type: "string", unique: true },
    phone: { type: "string" },
    imageLink: { type: "string", columnName: "image_link" },
    dateOfBirth: { type: "ref", columnName: "DoB", columnType: "datetime" },
    isLoginLocal : { type : "number" , columnName : "is_login_local"},
    isLoginGoogle : { type : "number" , columnName : "is_login_google"},
    googleId: { type : "string" , columnName : "google_id"},
    status : { type : 'number' ,columnName : "status"},
    secret : { type : 'string' ,columnName : 'secret'},
    roles: {
      collection: "Role",
      via: "userId",
      through: "UserAuthority",
    },
    comments: {
      collection: "Comment",
      via: "senderId",
    },
    trainingHistories: {
      collection: "TrainingHistory",
      via: "userId",
    },
    wishList: {
      collection: "Question",
      via: "userId",
      through: "WishList",
    },
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
    else 
    cb()
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
}

  