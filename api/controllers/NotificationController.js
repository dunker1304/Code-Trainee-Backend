/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getMostNotification : async (req , res)=> {
    try {
        let receiver = req.user ? req.user['id'] : 5
        let list  = await Notification.find({where : { receiver : receiver , isDeleted : false},limit : 10,sort: 'createdAt DESC'});
        return res.send({
              success :true,
              data : list
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
      let userId = req.user ? req.user['id'] : 5
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
      let userId = req.user ? req.user['id']: 5;

      let updated  = await Notification.update({id : notificationId , receiver : userId}).set({isDeleted : true})

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
      let userId = req.user ? req.user['id'] : 5;
      let noties = await Notification.find({ where : { receiver : userId , isDeleted : false} , sort : "createdAt DESC"})
      
      return res.send({
        success : true,
        data :noties
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

