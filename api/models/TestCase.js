module.exports = {
  tableName: "TestCase",
  attributes: {
    isHidden: { type: "boolean", columnName: "is_hidden", defaultsTo: false },
    input: { type: "string" },
    expectedOutput: { type: "string", columnName: "expected_output" },
    createdBy: { type: "number", columnName: "created_by" },
    exerciseId: {
      model: "Exercise",
      columnName: "exercise_id",
    },
  },
};
