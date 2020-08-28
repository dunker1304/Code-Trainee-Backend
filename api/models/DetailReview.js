module.exports = {
  tableName: "DetailReview",
  attributes: {
    comment: { type: "string" , allowNull : true },
    reviewer: { type: "number", columnName: "reviewer" },
    isAccepted: {
      type: "string",
      columnName: "is_accepted",
    },
    requestId: {
      model: "RequestReview",
      columnName: "request_id",
    },
  },
};
