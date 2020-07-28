/**
 * Notification.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "Notification",
  attributes: {
   content : { type : 'string' },
   isDeleted : { 
     type : 'boolean' ,
     columnName: "is_deleted",
     defaultsTo: false
     },
   isRead : { 
      type : 'boolean' ,
      columnName: "is_read",
      defaultsTo: false
    },
   type : { type : 'number' },
   linkAction : {
      type : 'string' ,
      allowNull : true ,
      columnName: "link_action",
    },

  receiver :   {
    model: "User",
    columnName: "receiver"
  }
    
  }

};

