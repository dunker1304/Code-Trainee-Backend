module.exports = {
  tableName: "Exercise",
  attributes: {
    points: { type: "number" },
    level: {
      type: "string",
      isIn: ["easy", "medium", "hard"],
      defaultsTo: "easy",
    },
    isDeleted: {
      type: "boolean",
      columnName: "is_deleted",
      defaultsTo: false,
    },
    isApproved: {
      type: "string",
      columnName: "is_approved",
    },
    like: { type: "number", defaultsTo: 0 },
    dislike: { type: "number", defaultsTo: 0 },
    content: { type: "string" ,allowNull  : true},
    title: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" },
    tags: {
      collection: "Tag",
      via: "exerciseId",
      through: "ExerciseTag",
    },
    comments: {
      collection: "Comment",
      via: "exerciseId",
    },
    trainingHistories: {
      collection: "TrainingHistory",
      via: "exerciseId",
    },
    testCases: {
      collection: "TestCase",
      via: "exerciseId",
    },
    codeSnippets: {
      collection: "CodeSnippet",
      via: "exerciseId",
    },
    wishListBy: {
      collection: "User",
      via: "exerciseId",
      through: "WishList",
    },
  },
};
