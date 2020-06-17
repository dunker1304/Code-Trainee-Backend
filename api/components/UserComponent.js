const MailService = require('../services/MailService');
module.exports = {
  sendEmail : async (data,secret)=> {
    let sender = {
      'email' : data.email,
      'subject' : '[CodeTrainee] Confirm Email',
      'content' : '',
      'html':`Welcome ${data.username}!
      <br/>
     Thanks for signing up with CodeTrainee!<br/>
     You must follow this link to activate your account:
     <a href= 'http://localhost:1337/accounts/confirm-email/${secret}'>http://localhost:1337/accounts/confirm-email/${secret}</a>
     <br/>Have fun coding, and don't hesitate to contact us with your feedback.`
    }

    await MailService.sendWelcomeMail(sender)
  },
  validateSignUp : (data)=> {
    
    //if empty 
    if(!data || !data.username || !data.email || !data.password ){
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
       console.log(data.password.length)
    //validate password
    if(data.password ) {
       if(data.password.length < 6 || data.password.length > 20) {
          return {
            success : false,
            message : 'Password must have at least 6 characters and at most 20 characters!'
          }
       }
    }

    //validate username
    if(data.username) {
      if(data.username.length > 20) {
        return {
          success : false,
          message : 'Username must have at most 20 characters!'
        }
      }
    }
    return {
      success :true ,
      message :''
    }
  }
 
}