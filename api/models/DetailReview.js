module.exports = {
  tableName: "DetailReview",
  attributes: {
    comment: { type: "string" },
    requestId: { type: "number", columnName: "request_id" },
    reviewer: { type: "number", columnName: "reviewer" },
    isAccepted: {
      type: "boolean",
      columnName: "is_accepted",
    },
  },
};
