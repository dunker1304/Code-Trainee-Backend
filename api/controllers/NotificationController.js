/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getMostNotification : async (req , res)=> {
    try {
       // let receiver = req.user ? req.user['id'] : 5
       let receiver= req.params.userId;
        let list  = await Notification.find({where : { receiver : receiver , isDeleted : false},limit : 4,sort: 'createdAt DESC'});

        //count noti chưa read
        let count = await Notification.count({ where : { receiver : receiver , isDeleted : false , isRead : false}});
        return res.send({
              success :true,
              data : {
                'listNoti' : list,
                'notRead' : count
              }
            })
    } catch (error) {
        console.log(error)
        return res.send({
          success : false,
          error : 1 ,
          data : []
        })
    }
  },
  maskAsRead : async ( req,res) => {
    try {
      let { notificationId,  isRead } = req.body
     // let userId = req.user ? req.user['id'] : 5
     let userId= req.body.userId;
      let updated  = await Notification.update({id : notificationId , receiver : userId}).set({isRead : isRead})

      return res.send({
        success  : true ,
        data : updated
      })
      
    } catch (error) {
      console.log(error)
      return {
        success : false ,
        data : {},
        error :1
      }
    }
  },
  removeNotification : async ( req , res)=> {
    try {
      let { notificationId } = req.body
     // let userId = req.user ? req.user['id']: 5;
     let userId= req.body.userId;
      let updated  = await Notification.update({id : notificationId , receiver : userId}).set({isDeleted : true}).fetch()

      return res.send({
        success  : true ,
        data : updated
      })
      
    } catch (error) {
      return res.send({
        success : false,
        error  : 1,
        data : {}
      })
    }
  },

  getAllNotification : async ( req,res) => {
    try {
      //let userId = req.user ? req.user['id'] : 5;
      let userId= req.params.userId;
      let limit = req.query.limit ? req.query.limit : 5;
      let page = req.query.page ? req.query.page : 1

      let noties = await Notification.find({ where : { receiver : userId , isDeleted : false} , sort : "createdAt DESC",limit : limit , skip : (page-1)*limit})
      
      let count = await Notification.count({ where : { receiver : userId , isDeleted : false} })
      
      return res.send({
        success : true,
        data :noties,
        page: count%limit == 0 ? count/limit : Math.floor(count/limit) + 1
      })
    } catch (error) {
      return res.send({
        success : false,
        error : 1,
        data : []
      })
    }
  },

  pushNotification: async (req, res) =>{
     try {
       let { reviewerIds, content, linkAction } = req.body;
       let notiPromises = reviewerIds.map((t) => {
         Notification.create({
           content: content,
           linkAction: linkAction,
           receiver: t,
           type: 2,
         });
       });

       await Promise.all(notiPromises);

       return res.json({
         success: true,
       });
     } catch (error) {
       return res.json({
         success: false,
       });
     }
  }
};

