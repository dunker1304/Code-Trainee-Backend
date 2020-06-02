module.exports = {
  tableName: "WishList",
  attributes: {
    userId: {
      model: "User",
      columnName: "user_id",
    },
    questionId: {
      model: "Question",
      columnName: "question_id",
    },
  },
};
