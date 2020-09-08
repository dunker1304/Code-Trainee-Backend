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
var popupTools = require('popup-tools');
signToken = (user) => {
  return JWT.sign({
    iss: 'CodeTrainee',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, CONSTANTS.JWT_SECRET);
}
module.exports = {

  googleAuth: async function (req, res, next) {
    req.session.role = req.params.role ;
    passport.authenticate('googleToken', { session: false, scope: ['profile', 'email'] })(req, res, next)
  }
  ,
  googleCallback: function (req, res, next) {
    passport.authenticate('googleToken', async function (err, data) {
      if (err) {
        // redirect to login page
        console.log('google callback error: ' + err);
      } else {
        
        let googleId = data.googleId ? data.googleId : '';
        let profile = data.profile ? data.profile : null;

        //get domain
        let url = '';
        let domain = ''
        if(sails.config.environment === 'development'){
            url = CONSTANTS.URL_FRONTEND_LOCAL
            domain = CONSTANTS.DOMAIN_FRONTEND_COOKIES_LOCAL
        }
        else {
            url = CONSTANTS.URL_FRONTEND_PROD
            domain = CONSTANTS.DOMAIN_FRONTEND_COOKIES_PROD
        }
        console.log('google credentials');
        //update role
        let role = req.session.role;
        if (googleId && profile && role) {
          console.log(role)

          let existUser = await User.findOne({ 'googleId': profile.id }).populate('roles', {id :role})
          if (existUser ) {

            if(existUser['roles'] && existUser['roles'].length > 0) {
              console.log('user has already exitss');

              //if accout is deactive
              if(existUser['isDeleted']) {
                return res.end(popupTools.popupResponse({"success" : false, "message" : 'Account is deactive! You cannot login!'}))
              }
            
              let token = await signToken(existUser)
              res.cookie('access_token', token, {
                httpOnly: false,
                domain : domain
              });
            
              //let redirect = CustomerComponent.switchRouterByRole(role)
             // res.redirect(`${url}${redirect}`)
              return res.end(popupTools.popupResponse({"success" : true, "message" : ""}))
            }

            if(existUser['roles'] && existUser['roles'].length == 0) {
              console.log('user has already exitss with other role');
            
              let token = await signToken(existUser)
              res.cookie('access_token', token, {
                httpOnly: false,
                domain : domain
              });
            
              return res.end(popupTools.popupResponse({"success" : false, 
                "message" : `Email ${profile.emails[0].value} is already registered with anthor role. 
                 Please use other email to register with this role `}))

            }
            
             
           
          }
          else {

            let email = profile.emails[0].value;
            let userLocal = await User.findOne({ 'email': email, 'isLoginLocal': 1 }).populate('roles', {id : role})

            if (userLocal && userLocal['roles'].length > 0) {
              console.log("exit account register local")
              let userUpdate = await User.updateOne({ email: email })
                .set({
                  googleId: profile.id,
                  displayName: profile.displayName,
                  imageLink: profile.photos[0].value,
                  isLoginGoogle: 1,
                  secret: ''
                })

              let token = await signToken(userUpdate)
              res.cookie('access_token', token, {
                httpOnly: false,
                domain :domain
              });
              // let redirect = CustomerComponent.switchRouterByRole(role)
              // res.redirect(`${url}${redirect}`)
              return res.end(popupTools.popupResponse({"success" : true, 
              "message" : `Email ${email} is already registered with your password. 
               Now you can sign In this account by google or your password`}))
          
            }
            else 
              if(userLocal && userLocal['roles'].length == 0) {
                //exist email with other role
                console.log("exist email with other role")
                // res.redirect(`${url}/`)
                return res.end(popupTools.popupResponse({"success" : false, 
                "message" : `Email ${email} is already registered with anthor role. 
                 Please use other email to register with this role `}))
              }
            else {
              try {
                console.log('creating new account');
                // //    console.log(profile)
                let newUser = {
                  'googleId': profile.id,
                  'email': profile.emails[0].value,
                  'imageLink': profile.photos[0].value,
                  'displayName': profile.displayName,
                  'isLoginGoogle': 1,
                  'username': profile.emails[0].value
                }
                // User.create(newUser);
                let user = await User.create(newUser).fetch();

              
                await User.addToCollection(user.id, 'roles').members([role]);
                
          
                let token = await signToken(user)
                res.cookie('access_token', token, {
                  httpOnly: false,
                  domain :domain
                });
                // let redirect = CustomerComponent.switchRouterByRole(role)
                // res.redirect(`${url}${redirect}`)
                return res.end(popupTools.popupResponse({"success" : true,  "message" : ""}))
               
              } catch (error) {
                console.log(error);
                // res.send({
                //   success : false,
                //   error : 1
                // })
                res.end(popupTools.popupResponse({"success" : false,  "message" : "Something wrong happened!"}))
              }

            }


          }
        }
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
        isLoginLocal: 1,
      })


      if (user && user.length > 0) {
        return res.status(200).json({ success: 'false', message: 'email or username already exist!' })
      }

      // Is there a Google account with the same email?
      let googleUser = await User.findOne({ 'email': data.email, 'isLoginGoogle': 1 }).populate("roles");
      if (googleUser) {

        // if google account ROLE != data.Role 
        if (googleUser.roles[0].id != data.role) {
          res.status(200).json({ success: false, message: 'Sorry! This email is already registered with another role! ' })
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
          'displayName' : data.displayName
        }

        let user = await User.create(newUser).fetch();
        await User.addToCollection(user.id, 'roles').members([data.role]);


        //send email to confirm
        await CustomerComponent.sendEmail(data, secret)

        res.status(200).json({ success: true, message: 'Please check your mailbox for new registration. If you do not receive any email, please check your junk or spam folder.' });
      }

    } catch (error) {
      res.status(200).json({ success: false, message: error['message'] });
    }
  }
  ,

  signIn: function (req, res, next) {
    passport.authenticate('local', async function (err, user, message) {

      if (!user) {
        return res.json({ 'success': false, 'message': message })
      }

      let domain = ''
      if(sails.config.environment == 'development') {
        domain = CONSTANTS.DOMAIN_FRONTEND_COOKIES_LOCAL
      }
      else 
       domain = CONSTANTS.DOMAIN_FRONTEND_COOKIES_PROD

      // Generate the token
      const token = await signToken(user);
      // Send a cookie containing JWT
      res.cookie('access_token', token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
        //secure: true,
        domain : domain,
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
        success: false,
        error: CONSTANTS.API_ERROR,
        data: {}
      })
    }





  },

  currentUser: function (req, res, next) {
    passport.authenticate('jwt', async function (err, user, message) {

      if (err) {
        return res.send({
          success: false,
          message: err
        })
      }


      if (!user) {
        return res.status(403).json({
          success: false,
          message: message ? message : 'Token Is Invalid'
        })
      }

      return res.status(200).json({
        success: true,
        user: user
      })


    })(req, res);
  }
  ,
  getUserById: async function (req, res) {
    try {
      let userId = req.params.userId;

      let user = await User.findOne({ id: userId })

      if (!user) {
        return res.send({
          success: false,
          data: {},
          message : 'User Not Found!',
          error: CONSTANTS.NOT_FOUND_USER
        })
      }
      let points = 0;

      let sub = await TrainingHistory.find({ where : { userId : user['id'] }}).populate('exerciseId')
        
      sub.forEach(element => {
        points+= element['exerciseId']['points']
      });

      user['points'] = points

      return res.send({
        success: true,
        data: user
      })
    } catch (error) {
      return res.send({
        success: false,
        data: {},
        error: CONSTANTS.API_ERROR
      })
    }
  },

  getExerciseOfAUser: async function (req, res) {
    try {
      let userId =  req.params.userId  ? req.params.userId :null

      //count All exercise
      let allExercise = await Exercise.count({ isApproved : 'Accepted' , isDeleted : 0});

      let easyE = 0;
      let mediumE = 0;
      let hardE = 0;
      let solved = 0;
      let acceptedSubmissions = 0;
      let wrongAnswer = 0;
      let runtimeError = 0;
      let totalSubmission = 0;
      let attempted = 0;
      let rateAcceptedSubmissions = 0;
       userId = parseInt(userId);
      if(Number.isInteger(userId) ) {

      let rawResult = await sails.sendNativeQuery(`SELECT * FROM Exercise WHERE id IN (SELECT DISTINCT \`exercise_id\` FROM \`TrainingHistory\` AS a WHERE \`is_finished\` = 1 AND \`status\` = \'Accepted\' AND user_id = ${userId}) AND is_deleted = 0`)
      
      // rawResult['rows'].forEach(ele => {
      //   if (ele['level'] == 'Easy') easyE++;
      //   if (ele['level'] == 'Medium') mediumE++;
      //   if (ele['level'] == 'Hard') hardE++;
      // });

      solved = rawResult['rows'] ? rawResult['rows'].length : 0;

      //count specific level if question
      easyE  = await Exercise.count({level:'easy' ,isApproved : 'Accepted' , isDeleted : 0})
      mediumE  = await Exercise.count({level :'medium',isApproved : 'Accepted' ,isDeleted : 0})
      hardE    = await Exercise.count({level :'hard',isApproved : 'Accepted' ,  isDeleted : 0})

      attempted = await sails.sendNativeQuery(`SELECT COUNT(DISTINCT \`exercise_id\`) AS attempted FROM \`TrainingHistory\` AS a WHERE \`is_finished\` = 1 AND user_id = ${userId}`)

      acceptedSubmissions = await TrainingHistory.count({ where: { isFinished: 1, status: 'Accepted', userId : userId } })

      wrongAnswer = await TrainingHistory.count({ where: { isFinished: 1, status: 'Wrong Answer', userId : userId } })

      runtimeError = await TrainingHistory.count({ where: { isFinished: 1, status: 'Runtime Error (NZEC)', userId : userId } })

      totalSubmission = await TrainingHistory.count({where: {userId : userId ,status: {'!=': 'Temp'}}})
    }

    return res.send({
      success: true,
      data: {

        total: allExercise, //tổng câu hỏi
        easy: easyE, // tổng câu easy- submit success
        medium: mediumE,// tổng câu medium- submit success
        hard: hardE,// tổng câu hard- submit success
        solved: solved, //tổng câu  submit success
        todo: allExercise - solved,
        attempted: attempted['rows'] && attempted['rows'][0] ? attempted['rows'][0]['attempted'] : 0, //sô câu hỏi đã submit
        acceptedSubmissions: acceptedSubmissions,// số lần submiss success,
        wrongAnswer: wrongAnswer,
        runtimeError: runtimeError,
        other: totalSubmission - (wrongAnswer + runtimeError + acceptedSubmissions),
        rateAcceptedSubmissions: !isNaN((acceptedSubmissions * 100/totalSubmission).toFixed(2))  ? (acceptedSubmissions * 100/totalSubmission).toFixed(2) : 0
      }
    })

    } catch (error) {
      console.log(error)
      return res.send({
        success: false,
        error: CONSTANTS.API_ERROR,
        data: {
          total: 0,
          easy: 0,
          medium: 0,
          hard: 0,
          solved: 0,
          todo: 0,
          attempted: 0
        }
      });
    }
  },

  getRole: async function (req, res) {
    try {
      let ignoreAdmin = req.body.ignoreAdmin
      let listRole = []

      if (ignoreAdmin) {
        listRole = await Role.find({ id: { '!=': 3 } });
      }
      else {
        listRole = await Role.find({});
      }
      sails.sentry.captureMessage("Another message");

      return res.send({
        success: true,
        data: listRole
      })


    } catch (error) {
      return res.send({
        success: false,
        data: [],
        error: CONSTANTS.API_ERROR
      })
    }
  },

  signOut: async function (req, res) {
    try {
      let domain = ''
      if(sails.config.environment == 'development') {
        domain = CONSTANTS.DOMAIN_FRONTEND_COOKIES_LOCAL
      }
      else 
       domain = CONSTANTS.DOMAIN_FRONTEND_COOKIES_PROD
      res.clearCookie('access_token', { domain : domain});
      // console.log('I managed to get here!');
      res.json({ success: true });

    } catch (error) {
      return res.send({
        success: false,
        error: CONSTANTS.API_ERROR
      })
    }
  },

  getAllTeachersActive: async (req, res) => {
    try {
      let {userId} = req.query;
      let teacherRoles = await Role.findOne({ id: 4 }).populate("users", {
        isDeleted: false
      });
      
      let activeTeachers = teacherRoles.users
        .filter(
          (t) =>
            (t.isLoginLocal === 1 && t.status === 1) || t.isLoginGoogle === 1
        )
        .filter((e) => e.id !== Number(userId));

      res.json({
        success: true,
        data: activeTeachers,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  }

};

