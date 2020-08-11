module.exports = {
  tableName: "RequestReview",
  attributes: {
    exerciseId: { type: "number", columnName: "exercise_id" },
    isAccepted: {
      type: "boolean",
      columnName: "is_accepted",
    },
  },
};
