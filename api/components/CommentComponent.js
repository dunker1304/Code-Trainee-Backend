const CONSTANT = require('../../config/custom').custom
module.exports = {
  validateAComment : (data)=> {
   
     
    //if content empty 
    if(!data.content ) {
      return {
        success : false,
        error : CONSTANT.VALIDATE_COMMENT_CONTENT,
        data :[]
      }
    }

    //if content to long
    if (data.content && data.content.length > 10000 ) {
      return {
        success : false,
        error : CONSTANT.VALIDATE_COMMENT_CONTENT_LENGTH,
        data : []
      }
    }

    if(data.title && data.title > 150){
      return {
        success : false,
        error : CONSTANT.VALIDATE_COMMENT_TITLE_LENGTH,
        data : []
      }
    }

    return {
      success : true
    }
  },

  createAVote : async (data) => {
    try {
      let { commentId  , statusVote ,isVoted } = data
      let afterUpdate = null
      let commentVote = data.comment
      let comment = await Comment.findOne({id : commentId})
  
      switch(statusVote) {
        case 0 : // remove vote
           if(commentVote['statusVote'] == 1){
             afterUpdate = await Comment.updateOne({id : commentId}).set({ like : comment.like - 1 })
           }
           else {
             if(commentVote['statusVote'] == -1)
               afterUpdate = await Comment.updateOne({id : commentId}).set({ dislike : comment.dislike - 1 })
             }
           break;
        case 1 : // vote like
          if(commentVote['statusVote'] == 0 || commentVote['statusVote'] == 1){
            afterUpdate = await Comment.updateOne({id : commentId}).set({ like : comment.like + 1 })
          }
          else {
            if(commentVote['statusVote'] == -1)
              afterUpdate = await Comment.updateOne({id : commentId}).set({ dislike : comment.dislike - 1 , like : comment.like + 1  })
            }
          break;
        case -1: //vote dislike  
          if(commentVote['statusVote'] == 0 || commentVote['statusVote'] == -1){
            afterUpdate = await Comment.updateOne({id : commentId}).set({ dislike : comment.dislike + 1 })
          }
          else {
            if(commentVote['statusVote'] == 1)
              afterUpdate = await Comment.updateOne({id : commentId}).set({ dislike : comment.dislike + 1 , like : comment.like - 1  })
            }
            
          break;

      }
    

      return {
        success : true,
        data : afterUpdate
      }
       
    } catch (error) {
     console.log(error)
       return {
         success : false,
         error : error
       }
    }
  }
}