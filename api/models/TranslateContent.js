/**
 * TranslateContent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    'id': { type: 'string', columnName: '_id' },
    'language_id' : { type : 'number' , required : true },
    'translatedContent' : { type : 'string' ,allowNull : true} ,
    'translatedTitle' : { type :'string' , allowNull : true }
  },

};

