module.exports = {
  tableName: "WishList",
  attributes: {
    userId: {
      model: "User",
      columnName: "user_id",
    },
    exerciseId: {
      model: "Exercise",
      columnName: "exercise_id",
    },
    type: {
      model : 'TypeWishList',
      columnName : "type"
    }
  },
};
