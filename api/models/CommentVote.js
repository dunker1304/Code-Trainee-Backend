module.exports = {
  tableName: "CommentVote",
  attributes: {
    statusVote : { type : "number" ,columnName : "status_vote" },
    userId: {
      model: "User",
      columnName: "user_id"
    },
    commentId: {
      model: "Comment",
      columnName: "comment_id"
    },
  },
};
