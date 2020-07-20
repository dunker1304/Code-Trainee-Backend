module.exports = {
  tableName: "Comment",
  attributes: {
    content: { type: "string" },
    parentId: { type: "number", columnName: "parent_id", defaultsTo: -1 },
    isDeleted: { type: "boolean", columnName: "is_deleted", defaultsTo: false },
    like: { type: "number", defaultsTo: 0 },
    dislike: { type: "number", defaultsTo: 0 },
    senderId: {
      model: "User",
      columnName: "sender_id"
    },
    exerciseId: {
      model: "Exercise",
      columnName: "exercise_id"
    },
    title : {
      type : "string",
      columnName: "title"
    }
  },
};
