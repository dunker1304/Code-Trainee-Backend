module.exports = {
  tableName: "TestCase",
  attributes: {
    isHidden: { type: "boolean", columnName: "is_hidden", defaultsTo: false },
    input: { type: "string" },
    expectedOutput: { type: "string", columnName: "expected_output" },
    executeTimeLimit: { type: "number", columnName: "execute_time_limit" },
    createdBy: { type: "number", columnName: "created_by" },
    questionId: {
      model: "Question",
      columnName: "question_id",
    },
  },
};
