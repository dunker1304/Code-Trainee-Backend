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
      let validate = await CustomerComponent.validateSignUp(data);

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
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        //secure: true,
        //domain : '.codetrainee.codes',
      });
      res.send({ success: true, message: 'Login successfully', 'user': user });
    })(req, res, next);
  },

  verifyAccount: async function (req, res) {
    try {
      const secret = req.params.secret;

      const user = await User.findOne({ 'secret': secret });
  
  
      if (!user)
        return res.status(200).json({ 'success': false, 'message': 'invalid token secret' })
  
      else {
        await User.update({ 'id': user.id }).set({ 'status': 1, 'secret': '' })
        return res.status(200).json({ 'success': true, 'message': 'confirm email success' });
      }
    } catch (error) {
      console.log(error)
       return res.send({
         success : false,
         error : CONSTANTS.API_ERROR,
         data : {}
       })
    }





  },

  currentUser: function (req, res, next) {
    passport.authenticate('jwt', async function (err, user, message) {

      if(err) {
        return res.send({
          success: false,
          message : err
        })
      }
      
   
      if(!user) {
        return res.status(403).json({
          success : false,
          message : message ? message :'Token Is Invalid'
        })
      }

      return res.status(200).json({
        success : true,
        user : user
      })
    
     
     })(req, res);
  }
  ,
  getUserById : async function ( req,res) {
    try {
      let  userId  = req.params.userId;

      let user = await User.findOne({id : userId})
  
      if(!user) {
        return res.send({
          success : false,
          data : {},
          error : CONSTANTS.NOT_FOUND_USER
        })
      }
  
      return res.send({
        success : true , 
        data : user
      })
    } catch (error) {
      return res.send({
        success : false,
        data : {},
        error : CONSTANTS.API_ERROR
      })
    }
  },

  getExerciseOfAUser : async function ( req ,res){
    try {
      let userId = req.user && req.user['id'] ? req.user['id']  :5;

      //count All exercise
      let allExercise = await Exercise.count({});

      //count specific level if question
      // let easyE  = await Exercise.count({level:'Easy'})
      // let mediumE  = await Exercise.count({level :'Medium'})
      // let hardE    = await Exercise.count({level :'Hard'})
      let easyE = 0;
      let mediumE = 0;
      let hardE = 0;
      

      let rawResult = await sails.sendNativeQuery(`SELECT * FROM Exercise WHERE id IN (SELECT DISTINCT \`exercise_id\` FROM \`TrainingHistory\` AS a WHERE \`is_finished\` = 1 AND \`status\` = \'Correct Answer\' AND user_id = ${userId}) `)

      rawResult['rows'].forEach(ele => {
         if(ele['level'] == 'Easy') easyE++;
         if(ele['level'] == 'Medium') mediumE++;
         if(ele['level'] == 'Hard') hardE++;
      });

      let  solved = easyE + mediumE + hardE; 

      let attempted = await sails.sendNativeQuery('SELECT COUNT(DISTINCT `exercise_id`) AS attempted FROM `TrainingHistory` AS a WHERE `is_finished` = 1 ')

      let acceptedSubmissions = await TrainingHistory.count({ where : { isFinished : 1 , status : 'Correct Answer'}})
      
      let wrongAnswer = await TrainingHistory.count({ where : { isFinished : 1 , status : 'Wrong Answer'}})

      let runtimeError = await TrainingHistory.count({ where : { isFinished : 1 , status : 'Runtime Error'}})

      let totalSubmission = await TrainingHistory.count({})
      return res.send({
        success : true,
        data : {

          total : allExercise, //tổng câu hỏi
          easy : easyE, // tổng câu easy- submit success
          medium : mediumE,// tổng câu medium- submit success
          hard : hardE,// tổng câu hard- submit success
          solved : solved, //tổng câu  submit success
          todo : allExercise - solved,
          attempted : attempted['rows'] && attempted['rows'][0] ? attempted['rows'][0]['attempted']: 0, //sô câu hỏi đã submit
          acceptedSubmissions : acceptedSubmissions ,// số lần submiss success,
          wrongAnswer : wrongAnswer,
          runtimeError : runtimeError,
          other : totalSubmission - (wrongAnswer + runtimeError + acceptedSubmissions ),
          rateAcceptedSubmissions : (acceptedSubmissions/totalSubmission).toFixed(2)*(100) 
        }
      })
      
    } catch (error) {
      console.log(error)
      return res.send({
        success : false,
        error : CONSTANTS.API_ERROR,
        data : {
          total : 0, 
          easy : 0,
          medium : 0,
          hard : 0,
          solved : 0, 
          todo : 0 ,
          attempted :  0
        }
      });
    }
  },

  getRole : async function ( req , res ) {
    try {
      let ignoreAdmin = req.body.ignoreAdmin
      let listRole = []

      if(ignoreAdmin) {
        listRole = await Role.find({id : { '!=' : 3}});
      }
      else {
        listRole = await Role.find({});
      }
      sails.sentry.captureMessage("Another message");

      return res.send({
        success : true , 
        data : listRole
      })
      
 
    } catch (error) {
      return res.send({
        success : false ,
        data : [],
        error : CONSTANTS.API_ERROR
      })
    }
  },

  signOut : async function ( req ,res) {
    try {
      res.clearCookie('access_token', { domain : 'localhost'});
      // console.log('I managed to get here!');
      res.json({ success: true });
      
    } catch (error) {
      return res.send({
        success : false,
        error : CONSTANTS.API_ERROR
      })
    }
  }
  
};

