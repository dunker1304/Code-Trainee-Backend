module.exports = {
  tableName: "DeletedUser",
  attributes: {
    userId: { type: "number", columnName: "user_id" },
    note: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" },
  },
};
