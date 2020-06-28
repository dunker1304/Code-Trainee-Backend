module.exports = {


  friendlyName: 'Empty object',


  description: '',


  inputs: {
    obj : {
      required :true,
      type :'json'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
      if(!inputs.obj) return true;
      return Object.keys(inputs.obj).length === 0 && inputs.obj.constructor === Object
  }
 

};

