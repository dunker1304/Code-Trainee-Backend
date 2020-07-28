const  CONSTANT = require("../../config/custom").custom
const CommentComponent = require('../components/CommentComponent');
module.exports = {

  //create a comment 
  createAComment :async (req,res)=> {
    
  try {
      //get data
    let { questionId , content , parentId , title } = req.body 
    let userId = req.user && req.user['id'] ?  req.user['id']  : 5


    //validate comment
    let validateComment = CommentComponent.validateAComment({content,title})

    if(!validateComment.success) {
      return res.send(validateComment)
    }

    if(!parentId) 
       parentId = -1;


    //create
    let comment = {
      'content' : content ,
      'exerciseId' : questionId,
      'senderId' : userId ,
      'parentId' : parentId,
      'title' : title
    }

    let resultCreate =  await Comment.create(comment).fetch()
    let afterCreated = await Comment.findOne({id:resultCreate['id']}).populate('senderId')
    let questionInfo = await Exercise.findOne({id : questionId});
    //send notification
    if(parentId == -1) {

      let sql = `select DISTINCT sender_id from Comment where parent_id = -1 and exercise_id = ${questionInfo['id']}`
      let receivers = await sails.sendNativeQuery(sql);
      
      if(receivers && receivers['rows']) {
        let tmp = receivers['rows'].map((value)=> {
          return value['sender_id']
        })
        let index = tmp.find(element => element == questionInfo['createdBy']);

        if(index == -1) 
        tmp.push(questionInfo['createdBy'])

        // tmp.forEach(element => {
          for(let i = 0 ;i <tmp.length ; i++  ){
            let info = {
              content : `<a href= '/profile/${req.user ? req.user['id'] : 5}'>${req.user ? req.user['name'] : 'Hoang aN'}</a> commented on <a href = '/playground?questionID=${questionInfo['id']} '>${questionInfo['title']}</a>`,
              linkAction : `/exercise/${questionInfo['id']}/discuss`,
              receiver : tmp[i],
              type : 1,
           }
           await Notification.create(info)
        }
      //  });
      }
      
    }
    else {
      //send notification to ower of this exercise
      let commentInfo = await Comment.findOne({ where : {id : parentId}})
      let info2 = {
        content : `<a href= '/profile/${req.user ? req.user['id'] : 5}'>${req.user ? req.user['name'] : 'Hoang aN'}</a> commented on <a href = '/playground?questionID=${questionInfo['id']} '>${questionInfo['title']}</a>`,
        linkAction : `/exercise/${questionInfo['id']}/discuss_${afterCreated['id']}`,
        receiver : questionInfo['createdBy'],
        type : 1,
     }
     await Notification.create(info2)

     //send to ower of this comment
     let info = {
      content : `<a href= '/profile/${req.user ? req.user['id'] : 5}'>${req.user ? req.user['name'] : 'Hoang aN'}</a> replied your comment on <a href = '/playground?questionID=${questionInfo['id']} '>${questionInfo['title']}</a>`,
      linkAction : `/exercise/${questionInfo['id']}/discuss_${afterCreated['id']}`,
      receiver : commentInfo['senderId'],
      type : 1,
    }
    await Notification.create(info)

    }
   
    
    return  res.send({
      success : true ,
      data : afterCreated
    })
    
  } catch (error) {
    console.log(error)
    return  res.send({
      success : false ,
      data : [],
      error : CONSTANT.API_ERROR
    })
  }

  },

  //vote a comment (like or dislike)
  voteAComment : async ( req , res) => {
  try {

  //get data
  let { statusVote , commentId }  = req.body
  let userId = req.user && req.user['id'] ? req.user['id'] : 5
  let isVoted = false

  CommentVote.findOrCreate({ commentId: commentId, userId:userId}, { commentId:commentId , userId:userId , statusVote :statusVote})
    .exec(async(err, comment, wasCreated)=> {
      if (err) { 
        console.log(err)
        return res.send({
          success : false,
          error : CONSTANT.API_ERROR
        })
      }
      if(wasCreated) {

        //update vote number
        let result = await CommentComponent.createAVote({commentId,statusVote,isVoted,comment})

        return res.send(result)

        
      }
      else {
        // if existing -> update 
        isVoted = true
       
        //update vote of number
        let result = await CommentComponent.createAVote({commentId,statusVote,isVoted,comment})
       // console.log(result)

        let vote = await CommentVote.updateOne({ commentId , userId}).set({statusVote : statusVote})

        return res.send(result)
        
      }
    });

   } catch (error) {
    console.log(error)
     return res.send({
       success : false ,
       error :error
     })
   }
  },  

  // get comment by question id : 
  getCommentByQuestionId : async (req , res) => {
    try {
      let { questionId , page , sortBy} = req.body
      let sortText = 'DESC' 
      if(!page) page = 1
      if(sortBy == 1 ) {
         sortText = 'ASC'
      }
      let listComment = await Comment.find({ where : { exerciseId : questionId , parentId : -1 , isDeleted : 0} , 
        skip: (page -1) * 2,
        limit: 2,
        sort: `createdAt ${sortText}` }).populate('senderId')

    
        for(let i= 0 ;i< listComment.length ; i++){
           let totalReply = await Comment.count({where : { parentId : listComment[i]['id'], isDeleted : 0}})
           listComment[i]['totalReply'] = totalReply
        }

        let totalCmts = await Comment.count({ where : { exerciseId : questionId , parentId : -1 , isDeleted : 0}} )

        return res.send({
          success : true,
          data : {
            comments :listComment,
            total : totalCmts
          }
        })
    } catch (error) {

      return res.send({
        success : false,
        data : {
          comments :0,
          total : 0
        },
        error: error.message
      })
      
    }
  },

  //get comment by commentId : 
  getCommentByCommentId : async ( req, res )=> {
    try {
      let { commentId } = req.body
      let userId = req.user && req.user['id'] ? req.user['id'] : 5
      let comment = await Comment.findOne({where : { id : commentId }}).populate('senderId')

      let commentVoted = await CommentVote.findOne({where : { commentId : comment['id'], userId : userId}})
      if(commentVoted) {
        comment['statusVote'] = commentVoted['statusVote']
        console.log(comment)
      }

      if(comment && comment.senderId && comment.senderId.id == userId) {
        comment['isYourComment'] = true
      }
      else 
        comment['isYourComment'] = false
      let commentChildren = await Comment.find({where : {parentId: comment.id, isDeleted : 0}, sort: `createdAt DESC`}).populate('senderId')

      // commentChildren.forEach(element => {
        for(let i =0 ;i < commentChildren.length ; i++) {
        if(commentChildren[i] && commentChildren[i].senderId && commentChildren[i].senderId.id == userId) {
          commentChildren[i]['isYourComment'] = true
        }
        else 
        commentChildren[i]['isYourComment'] = false
         
        let commentChildrenVoted = await CommentVote.findOne({where : {commentId :  commentChildren[i]['id'], userId : userId}})
        if(commentChildrenVoted) {
          commentChildren[i]['statusVote'] = commentChildrenVoted['statusVote']
        }
    //  });
      }
      comment['children'] = commentChildren;
      return res.send({
        success : true ,
        data :comment
      })
    } catch (error) {
      console.log(error)
       return res.send({
         success : false ,
         data : {}, 
         error : error
       })
    }
  },

  // delete A comment :
  deleteAComment : async ( req,res) => {
    let {commentId} = req.body;
    let userId = req.user && req.user.id ? req.user.id: 5

    let comment  = await Comment.updateOne({ id : commentId , senderId : userId }).set({isDeleted : 1})

    if(!comment) {
      return res.send({
        success : false ,
        error : CONSTANT.UN_AUTH_TO_DELETE,
        data  : {}
      })
    }

    return res.send({
      success : true ,
      data : comment
    })
    

  }
}