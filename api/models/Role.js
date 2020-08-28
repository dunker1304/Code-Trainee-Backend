module.exports = {
  tableName: "Role",
  attributes: {
    name: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" ,allowNull : true },
    users: {
      collection: "User",
      via: "roleId",
      through: "UserAuthority",
    },
  },
};
