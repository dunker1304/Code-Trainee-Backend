module.exports = {
  tableName: "TrainingHistory",
  attributes: {
    timeNeeded: { type: "number", columnName: "time_needed" },
    status: { type: "string", defaultsTo: "" },
    answer: { type: "string" },
    isFinished: {
      type: "boolean",
      columnName: "is_finished",
      defaultsTo: false,
    },
    exerciseId: {
      model: "Exercise",
      columnName: "exercise_id",
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
