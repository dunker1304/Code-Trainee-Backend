module.exports = {
  tableName: "Role",
  attributes: {
    name: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" },
    users: {
      collection: "User",
      via: "roleId",
      through: "UserAuthority",
    },
  },
};
