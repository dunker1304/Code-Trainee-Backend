module.exports = {
  tableName: "TrainingHistory",
  attributes: {
    timeNeeded: { type: "number", columnName: "time_needed" },
    points: { type: "number", defaultsTo: 0 },
    answer: { type: "string" },
    idFinished: {
      type: "boolean",
      columnName: "is_finished",
      defaultsTo: false,
    },
    questionId: {
      model: "Question",
      columnName: "question_id",
    },
    userId: {
      model: "User",
      columnName: "user_id",
    },
    programLanguageId: {
      model: "ProgramLanguage",
      columnName: "program_language_id",
    },
  },
};
