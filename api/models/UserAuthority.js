module.exports = {
  tableName: "UserAuthority",
  attributes: {
    userId: {
      model: "User",
      columnName: "user_id",
    },
    roleId: {
      model: "Role",
      columnName: "role_id",
    },
    createdBy: { type: "number", columnName: "created_by" },
  },
};
