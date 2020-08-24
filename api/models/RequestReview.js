module.exports = {
  tableName: "RequestReview",
  attributes: {
    exerciseId: { type: "number", columnName: "exercise_id" },
    selfComment: { type: "string", columnName: "self_comment" },
    isSelfReview: {
      type: "boolean",
      columnName: "is_self_review",
      defaultsTo: false,
    },
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
