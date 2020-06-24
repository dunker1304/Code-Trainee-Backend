/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const passport = require('passport');
const JWT = require('jsonwebtoken');
const passportGoogle = passport.authenticate('googleToken', { session: false })
const CONSTANTS = require('../../config/custom').custom;
const LocalStrategy = require('passport-local').Strategy;
const CustomerComponent = require('../components/UserComponent')
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

  googleAuth: async function (req, res,next) {
    req.session.role = 1;
    passport.authenticate('googleToken', {session : false, scope: ['profile', 'email'],role:1})(req,res,next)
  }
  ,
  googleCallback: function (req, res, next) {
    console.log(req.session)
    passport.authenticate('googleToken', async function (err, user) {
      if (err) {
        // redirect to login page
        console.log('google callback error: ' + err);
      } else {
        console.log('google credentials');
       // console.log(user);
       //update role
       let role = req.session.role;
       
        let token = await signToken(user)
        res.cookie('access_token', token, {
          httpOnly: true
        });
        res.redirect('http://localhost:3000')
        // res.status(200).json({ success: true });
      }
    })(req, res, next);
  },

  signUp: async function (req, res) {
    try {
      let secret = uniqueString();
      let data = req.body
    
      //validate request
      let validate = CustomerComponent.validateSignUp(data);

      if (!validate['success']) {
        return res.json(validate)
      }

      //process signup
      // Check if there is a user with the same email
      //let user = await User.findOne({'email' : data.email , 'isLoginLocal' : 1})

      let user = await User.find().where({
        or: [
          { 'email': data.email },
          { 'username': data.username }
        ],
        isLoginLocal: 1
      })

  
      if (user && user.length > 0) {
        return res.status(200).json({ success: 'false', message: 'email or username already exist!' })
      }

      // Is there a Google account with the same email?
      let googleUser = await User.findOne({ 'email': data.email, 'isLoginGoogle': 1 }).populate("roles");
      if (googleUser) {

        // if google account ROLE != data.Role 
        if(googleUser.roles[0].id != data.role) {
          res.status(200).json({success: false,message :'Sorry! This email is already registered with another role! '})
        }
        else {
            await User.update({ 'email': data.email }).set({
            'isLoginLocal': 1,
            'password': data.password,
            'secret': secret,
            'username': data.username
          })

        //send email to confirm account
        await CustomerComponent.sendEmail(data, secret)

        res.status(200).json({ success: true, message: 'Please check your mailbox for new registration. If you do not receive any email, please check your junk or spam folder.' });
        }
      }
      else {
        // Create a new user
        const newUser = {
          'email': data.email,
          'password': data.password,
          'isLoginLocal': 1,
          'username': data.username,
          'secret': secret,
        }

        let user = await User.create(newUser).fetch();
        await User.addToCollection(user.id, 'roles').members([data.role]);
      

        //send email to confirm
        await CustomerComponent.sendEmail(data,secret)

        res.status(200).json({ success: true, message: 'Please check your mailbox for new registration. If you do not receive any email, please check your junk or spam folder.' });
      }

    } catch (error) {
      res.status(200).json({ success: false, message: error });
    }
  }
  ,

  signIn: function (req, res, next) {
    passport.authenticate('local', async function (err, user, message) {

      if (!user) {
        return res.json({ 'success': false, 'message': message })
      }

      // Generate the token
      const token = await signToken(user);
      // Send a cookie containing JWT
      res.cookie('access_token', token, {
        httpOnly: true
      });
      res.send({ success: true, message: 'Login successfully', 'user': user });
    })(req, res, next);
  },

  verifyAccount: async function (req, res) {
    const secret = req.params.secret;

    const user = await User.findOne({ 'secret': secret });


    if (!user)
      return res.status(200).json({ 'success': false, 'message': 'invalid token secret' })

    else {
      await User.update({ 'id': user.id }).set({ 'status': 1, 'secret': '' })
      return res.status(200).json({ 'success': true, 'message': 'confirm email success' });
    }





  },

  currentUser: function (req, res, next) {
    passport.authenticate('jwt', async function (err, user, message) {


      res.send({ success: true, message: 'GET SUCCESS', 'user': user });
    })(req, res, next);
  }
};
