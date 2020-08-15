module.exports = {
  tableName: "RequestReview",
  attributes: {
    exerciseId: { type: "number", columnName: "exercise_id" },
    isAccepted: {
      type: "string",
      columnName: "is_accepted",
    },
    details: {
      collection: "DetailReview",
      via: "requestId",
    },
  },
};
