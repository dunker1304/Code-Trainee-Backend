module.exports = {
  tableName: "QuestionCategory",
  attributes: {
    questionId: {
      model: "Question",
      columnName: "question_id",
    },
    categoryId: {
      model: "Category",
      columnName: "category_id",
    },
  },
};
