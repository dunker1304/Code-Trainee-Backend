module.exports = {
  tableName: "CodeSnippet",
  attributes: {
    createdBy: { type: "number", columnName: "created_by" },
    sampleCode: { type: "string", columnName: "sample_code" },
    isActive: { type: "boolean", columnName: "is_active", defaultsTo: false },
    exerciseId: {
      model: "Exercise",
      columnName: "exercise_id",
    },
    programLanguageId: {
      model: "ProgramLanguage",
      columnName: "program_language_id",
    },
  },
};