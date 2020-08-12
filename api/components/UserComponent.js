const MailService = require('../services/MailService');
const CONSTANTS = require('../../config/custom').custom
module.exports = {
  sendEmail : async (data,secret)=> {
    
    let url = ''
    if(sails.config.environment == 'development') {
      url = CONSTANTS.URL_FRONTEND_LOCAL
    }
    else 
      url = CONSTANTS.URL_FRONTEND_PROD
    let sender = {
      'email' : data.email,
      'subject' : '[CodeTrainee] Confirm Email',
      'content' : '',
      'html':`Welcome ${data.username}!
      <br/>
     Thanks for signing up with CodeTrainee!<br/>
     You must follow this link to activate your account:
     <a href= '${url}/verifyAccount?secret=${secret}'>${url}/verifyAccount?secret=${secret}</a>
     <br/>Have fun coding, and don't hesitate to contact us with your feedback.`
    }

    await MailService.sendWelcomeMail(sender)
  },
  validateSignUp : async (data)=> {

    //if empty 
    if(!data || !data.username || !data.email || (data.key != 'admin-edit' && !data.password) ){
      return {
        success : false,
        message : 'Please fill out all information!'
      }
    }

    if(!data.role){
      return {
        success : false,
        message : 'Please choose your role!'
      }
    }

    //validate email 
    if(data.email) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (reg.test(data.email) == false) 
      {
          return {
            success : false,
            message : 'Format of email is invalid!'
          }
      }
    }
      
    //validate password
    if(data.password ) {
       if(data.password.length < 6 || data.password.length > 30) {
          return {
            success : false,
            message : 'Password must have at least 6 characters and at most 30 characters!'
          }
       }
    }

    //validate username
    if(data.username) {
      let validateSpecial = await sails.helpers.validateSpecial.with({
        value : data.username
      });
      if(!validateSpecial){
        return {
          success : false,
          message : 'Username have special character!'
        }
      }
      if(data.username.length > 30) {
        return {
          success : false,
          message : 'Username must have at most 30 characters!'
        }
      }
    }

    //validate displayName
    if(data.displayName) {

      let validateSpecial = await sails.helpers.validateSpecial.with({
        value : data.displayName
      });
      if(!validateSpecial){
        return {
          success : false,
          message : 'Displayname have special character!'
        }
      }

      if(data.displayName.length > 30 || data.displayName.length < 4) {
        return {
          success : false,
          message : 'Displayname must have at most 30 characters and at least 4 characters!'
        }
      }
    }

    //validate phone
    if(data.phone) {
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if(data.phone.match(phoneno)) {
          return {
            success : true , 

          }
        }
        else  {
          return {
            success : false,
            message : 'Phone number is invalid!'
          }
        }
    }
    return {
      success :true ,
      message :''
    }
  },

  switchRouterByRole :  (role)=> {
    switch (Number(role)) {
      case CONSTANTS.ROLE.AMDIN : 
          return '/admin/accounts';
      case CONSTANTS.ROLE.TEACHER:
          return '/exercise'    ;
      case CONSTANTS.ROLE.STUDENT:
          return '/problem';    
    }
  }
 
}