module.exports = {
  tableName: "Category",
  attributes: {
    name: { type: "string", required: true },
    createdBy: { type: "number", columnName: "created_by" },
    questions: {
      collection: "Question",
      via: "categoryId",
      through: "QuestionCategory",
    },
  },
};
