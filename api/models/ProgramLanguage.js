module.exports = {
  tableName: "ProgramLanguage",
  attributes: {
    name: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" },
    trainingHistories: {
      collection: "TrainingHistory",
      via: "programLanguageId",
    },
    codeSnippets: {
      collection: "CodeSnippet",
      via: "programLanguageId",
    },
  },
};
