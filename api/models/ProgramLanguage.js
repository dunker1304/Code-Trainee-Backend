module.exports = {
  tableName: "ProgramLanguage",
  attributes: {
    name: { type: "string" },
    code: { type: "number", description: "code map to Judge0, ex: Java: 62" },
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
