module.exports = {
  tableName: "CodeSnippet",
  attributes: {
    createdBy: { type: "number", columnName: "created_by" },
    functionName: { type: "string", columnName: "function_name" },
    returnType: { type: "string", columnName: "return_type" },
    questionId: {
      model: "Question",
      columnName: "question_id",
    },
    parameters: {
      collection: "Parameter",
      via: "snippetId",
    },
    programLanguageId: {
      model: "ProgramLanguage",
      columnName: "program_language_id",
    },
  },
};
