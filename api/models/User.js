module.exports = {
  tableName: "User",
  attributes: {
    username: { type: "string", unique: true },
    password: { type: "string" },
    displayName: { type: "string", columnName: "display_name" },
    email: { type: "string", unique: true },
    phone: { type: "string" },
    imageLink: { type: "string", columnName: "image_link" },
    dateOfBirth: { type: "ref", columnName: "DoB", columnType: "datetime" },
    roles: {
      collection: "Role",
      via: "userId",
      through: "UserAuthority",
    },
    comments: {
      collection: "Comment",
      via: "senderId",
    },
    trainingHistories: {
      collection: "TrainingHistory",
      via: "userId",
    },
    wishList: {
      collection: "Question",
      via: "userId",
      through: "WishList",
    },
  },
};
