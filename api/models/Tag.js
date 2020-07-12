module.exports = {
  tableName: "Tag",
  attributes: {
    name: { type: "string" },
    createdBy: { type: "number", columnName: "created_by" },
    exercises: {
      collection: "Exercise",
      via: "tagId",
      through: "ExerciseTag",
    },
  },
};
