module.exports = {


  friendlyName: 'Validate special',


  description: '',


  inputs: {
    value : {
      required :true,
      type :'string'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    var TCode = inputs.value;

    if( /[^a-zA-Z0-9\-\_]/.test( TCode ) ) {
        return false;
    }

    return true;  
  }


};

