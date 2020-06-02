module.exports = {
  tableName: "Question",
  attributes: {
    points: { type: "number" },
    level: { type: "string", isIn: ["easy", "medium", "hard"] },
    isDeleted: { type: "boolean", columnName: "is_deleted" },
    isApproved: { type: "boolean", columnName: "is_approved" },
    otherRequire: { type: "string", columnName: "other_require" },
    limitCharaters: { type: "number", columnName: "limit_code_characters" },
    like: { type: "number" },
    dislike: { type: "number" },
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
    testcases: {
      collection: "TestCase",
      via: "questionId",
    },
    codeSnippets: {
      collection: "CodeSnippet",
      via: "questionId"
    }
  },
};
