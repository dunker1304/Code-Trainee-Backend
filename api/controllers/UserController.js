/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const passport = require('passport');
const JWT  = require('jsonwebtoken');
const passportGoogle = passport.authenticate('googleToken', {session : false})
const CONSTANTS  = require('../../config/custom').custom;
const MailService = require('../services/MailService');
const uniqueString = require('unique-string');
signToken = user => {
    return JWT.sign({
      iss: 'CodeTrainee',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, CONSTANTS.JWT_SECRET);
  }
module.exports = {
  
   googleAuth : async function(req,res){
      // let token = await signToken(req.user)
      // res.cookie('access_token', token, {
      //   httpOnly: true
      // });
      // res.status(200).json({ success: true });
      // passport.authenticate('googleToken', {
      //   scope: ['profile', 'email']
      // })
   },
   googleCallback: function(req, res, next) {
    passport.authenticate('googleToken', function(err, user) {
      if(err) {
        // redirect to login page
        console.log('google callback error: '+err);
      } else {
        console.log('google credentials');
        console.log(user);
        res.json(user);
      }
    })(req, res, next);
  },

   signUp : async function( req, res) {

    // validate req 
    let data = req.body 
    if(!data || !data.email || !data.password) {
      res.status(200).json({success : false , message : 'Email or password invalid'});
    }

    //process signup
    // Check if there is a user with the same email
    let user = await User.findOne({'email' : data.email , 'isLoginLocal' : 1})

    if(user) {
       return res.status(403).json({success : 'false' ,  message : 'email already exist!'})
    }

     // Is there a Google account with the same email?
     let googleUser = await User.findOne({'email' : data.email , 'isLoginGoogle' : 1});
     if(googleUser) {

       await User.update({'email':data.email}).set({
         'isLoginLocal' : 1,
         'password': data.password
      })

      // Generate the token
      const token = await signToken(googleUser);
      // Respond with token
      res.cookie('access_token', token, {
        httpOnly: true
      });
      res.status(200).json({ success: true });

     }
     else {
        // Create a new user
          let secret = uniqueString();
          const newUser = {
            'email' : data.email ,
            'password': data.password,
            'isLoginLocal' : 1,
            'username' : data.username,
            'secret' : secret
          }

          await User.create(newUser);

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


          // Generate the token
          const token = await signToken(newUser);
          // Send a cookie containing JWT
          res.cookie('access_token', token, {
            httpOnly: true
          });
          res.status(200).json({ success: true });


     }

   
   },

   signIn: async function ( req, res) {
      // Generate token
    const token = await signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
      
   },

   verifyAccount : async function( req ,res ){
     const secret = req.params.secret;
     
     const user = await User.findOne({'secret' : secret});

    
     if(!user) 
        return res.status(200).json({'success' : false , 'message' : 'invalid token secret'})
     
    else {
      await User.update({'id' : user.id}).set({'status' : 1 , 'secret' : ''})
      return res.status(200).json({ 'success' : true , 'message': 'confirm email success'});
    }

  


    
   }
};

