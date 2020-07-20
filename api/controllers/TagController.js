module.exports = {
  getTagsByExerciseId: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let exercises = await Exercise.findOne({
        id: exerciseId,
      }).populate("tags");
      res.json({
        success: true,
        data: exercises.tags,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
  getAllTags: async (req, res) => {
    try {
      let tags = await Tag.find();
      res.json({
        success: true,
        data: [...tags],
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
};
