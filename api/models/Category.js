module.exports = {
  tableName: "Category",
  attributes: {
    name: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" },
    questions: {
      collection: "Question",
      via: "categoryId",
      through: "QuestionCategory",
    },
  },
};
