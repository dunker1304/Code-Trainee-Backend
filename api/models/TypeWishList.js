/**
 * TypeWishList.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: "TypeWishList",
  attributes: {
   name : { type : 'string' , allowNull : false},
   createdBy : {
     model : 'User',
     columnName : 'created_by'
   }
  },
};

