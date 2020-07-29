module.exports = {
  tableName: "ExerciseVote",
  attributes: {
    statusVote: {
      type: 'number', columnName: "status_vote"
    },
    userId: {
      model: "User", columnName: "user_id"
    },
    exerciseId: {
      model: "Exercise", columnName: "exercise_id"
    }
  }
}