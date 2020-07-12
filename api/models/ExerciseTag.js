module.exports = {
  tableName: "ExerciseTag",
  attributes: {
    exerciseId: {
      model: "Exercise",
      columnName: "exercise_id",
    },
    tagId: {
      model: "Tag",
      columnName: "tag_id",
    },
  },
};
