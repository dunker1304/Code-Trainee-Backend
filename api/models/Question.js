module.exports = {
  tableName: "Question",
  attributes: {
    points: { type: "number" },
    level: { type: "string", isIn: ["easy", "medium", "hard"] },
    isDeleted: {
      type: "boolean",
      columnName: "is_deleted",
      defaultsTo: false,
    },
    isApproved: {
      type: "boolean",
      columnName: "is_approved",
      defaultsTo: false,
    },
    otherRequire: { type: "string", columnName: "other_require" },
    limitCharaters: { type: "number", columnName: "limit_code_characters" },
    like: { type: "number", defaultsTo: 0 },
    dislike: { type: "number", defaultsTo: 0 },
    content: { type: "string" },
    title: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" },
    categories: {
      collection: "Category",
      via: "questionId",
      through: "QuestionCategory",
    },
    comments: {
      collection: "Comment",
      via: "questionId",
    },
    trainingHistories: {
      collection: "TrainingHistory",
      via: "questionId",
    },
    testCases: {
      collection: "TestCase",
      via: "questionId",
    },
    codeSnippets: {
      collection: "CodeSnippet",
      via: "questionId",
    },
    wishListBy: {
      collection: "User",
      via: "questionId",
      through: "WishList",
    },
  },
};
