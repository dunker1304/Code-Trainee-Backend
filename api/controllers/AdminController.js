
const CONSTANTS = require( "../../config/custom").custom
const UserComponent = require("../components/UserComponent")
const uniqueString = require('unique-string');
const moment = require("moment");
const fuzzysort = require('fuzzysort')


module.exports = {
  getUserByRole : async function(req,res)  {
     try {
      let { role } = req.body
      let page = req.body.page ? req.body.page : 1
      let keySearch = req.body.keySearch ? req.body.keySearch : ''
      let pageSize = 20;
      let condition = {}

      if(role != -1) {
        condition['roleId'] = role
      }
      let listUser = await UserAuthority.find({ where :  condition , sort: `createdAt DESC`, limit : pageSize , skip : (page-1)*pageSize}).populate('userId').populate('roleId');
      let result = [];

      //totalPage
      let total = await UserAuthority.count({ where :  condition })

      listUser.forEach( (element,index) => {
        let user = {
          id : element['userId']['id'],
          index : index + 1,
          key : index + 1,
          email: element['userId']['email'],
          role: element['roleId']['name'],
          username : element['userId']['username'],
          isDeleted : element['userId']['isDeleted'] ,
          statusNumber : element['userId']['status'],
          status: element['userId']['isDeleted'] ? 'Deactive' : element['userId']['status'] == 0 ? 'UnConfirmed':'Active',
        }

        result.push( user)
      });
      
      return res.send({
        success : true,
        data : {
          'users' : result,
          'total' : total
        }
      })

     } catch (error) {
       console.log(error)
       return res.send({
         success : false,
         data : [],
         error : CONSTANTS.API_ERROR
       })
     }
  },

  getUserById : async function(req,res){
    let { userId} = req.body;
  
    try {
      let user = await User.findOne({ id : userId}).populate('roles')
    
      if(user) {
        delete user['isLoginLocal']
        delete user['isLoginGoogle']
        delete user['googleId']
        return res.send({
          success : true , 
          data : user
        })
      
      }
      return res.send({
        success : true , 
        data : {}
      })
     
      
    } catch (error) {
      console.log(error)
      return res.send({
        success : false ,
        data : {},
        error : CONSTANTS.API_ERROR
      })
    }

  },

  editAnAccount : async function(req , res) {
    try {
      let { displayName , dateOfBirth , phone, userId } = req.body


      //valiate - info

      let validate = await UserComponent.validateSignUp(req.body)

      if(!validate['success']) {
        return res.send(validate)
      }
 
      await User.updateOne({ id : userId}).set({ displayName : displayName , dateOfBirth : dateOfBirth ? moment(dateOfBirth,'DD-MM-YYYY').format('YYYY-MM-DD'): null, phone :phone  })
 
     
      return res.send({
        success : true , 
        message : CONSTANTS.EDIT_ACCOUNT_SUCCESS
      })

    } catch (error) {
      console.log(error)
      return res.send({
        success : false,
        error : CONSTANTS.API_ERROR,
        data : {}
      })
    }

  },

  createAnAccount : async function ( req , res) {
    try {
      let { username , displayName , email , phone, dateOfBirth, role ,key} = req.body
      let data = req.body
      data['password'] = 'codetrainee@123'
      let secret = uniqueString();
  
      //validate 
      let validate  = await UserComponent.validateSignUp(data)

      if(!validate['success']) {
        return res.send(validate)
      }

      let dateToCreate  = {
        username : username,
        displayName : displayName,
        email : email ,
        phone : phone ? phone : '',
        dateOfBirth :  dateOfBirth ? moment(dateOfBirth,'DD-MM-YYYY').format('YYYY-MM-DD'): null,
        password : data['password'],
        secret : secret,
        isLoginLocal : true
      }

      //validate -username - email 

      let findUser = await User.findOne({username : username})

      if(findUser) {
        return res.send({
          success : false,
          data : {},
          error : 1 ,
          message : 'Username have already exist!'
        })
      }

      let findUserEmail = await User.findOne({email : email})

      if(findUserEmail) {
        return res.send({
          success : false,
          data : {},
          error : 1 ,
          message : 'Email have already exist!'
        })
      }



      let created = await User.create(dateToCreate).fetch()

      if(created) {

        //add role
        await User.addToCollection(created['id'], 'roles').members(role);

        //send email - confirm email
        await UserComponent.sendEmail(dateToCreate , secret)

        return res.send({
          success : true , 
          message : 'Add Account Successfully With Default Password: codetrainee@123. Please Check Your Email To Confirm!',
        })
      }

      return res.send({
        success : false , 
        error : CONSTANTS.API_ERROR ,
        data : {}
      })

    } catch (error) {
      console.log(error)
      return res.send({
        success : false , 
        error : CONSTANTS.API_ERROR ,
        data : {}
      })
    }
  },

  getUserByRoleWithKeySearch : async function (req , res) {
    try {
      let { keySearch , role} = req.body;
      let condition = {}
  
      if(role != -1) {
        condition['roleId'] = role
      }
      let listUser = await UserAuthority.find({  where : condition , sort: `createdAt DESC`, limit : 100 }).populate('userId').populate('roleId');
      const results = await fuzzysort.goAsync(keySearch, listUser, { keys:['userId.email', 'userId.username', 'userId.displayName'] })
      let result = []
      let total = 0;
      results.forEach( (element,index) => {
        let user = {
          id : element['obj']['userId']['id'],
          index : index + 1,
          email: element['obj']['userId']['email'],
          role: element['obj']['roleId']['name'],
          username : element['obj']['userId']['username'],
          status: element['obj']['userId']['isDeleted'] ? 'Deactive' : element['obj']['userId']['status'] == 0 ? 'UnConfirmed':'Active',
        }

        result.push( user)
      });

      return res.send({
        success : true,
        data :{
          'users' : result,
          'total' : total
        }
      })
      
    } catch (error) {
      console.log(error)
      return res.send({
        success : false,
        data : {
          users : [],
          total : 0
        },
        error : CONSTANTS.API_ERROR
      })
    }
  },
  deactiveAccount : async function ( req,res) {
    try {
      let { userId , value , key } = req.body;
       
      let data = {};
      let message = '';
      if(key == 'confirm') {
         data['status'] = value;
         message = 'Confirm Account Success!'
      }
      if(key == 'active') {
        data['isDeleted'] = value;
        message = value ? 'Now, Account Is Deactive' : 'Now, Account Is Active'
      }

      await User.updateOne({ id : userId}).set(data)

      return res.send({
        success : true , 
        message : message
      })
       
    } catch (error) {
      
      console.log(error)
      return res.send({
        success : false,
        error : CONSTANTS.API_ERROR,
        data : {}
      })
      
    }
  }


}