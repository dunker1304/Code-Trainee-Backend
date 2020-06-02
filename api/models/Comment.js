module.exports = {
  tableName: "Comment",
  attributes: {
    content: { type: "string" },
    parentId: { type: "number", columnName: "parent_id" },
    isDeleted: { type: "boolean", columnName: "is_deleted" },
    like: { type: "number" },
    dislike: { type: "number" },
    senderId:{
      model: "User",
      columnName: "sender_id"
    },
    questionId: {
      model: "Question",
      columnName: "question_id"
    }
  },
};
