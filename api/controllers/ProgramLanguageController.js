module.exports = {
  getAllByExercise: async (req, res) => {
    try {
      let { exerciseId } = req.query;
      let all = await ProgramLanguage.find().populate("codeSnippets", {
        exerciseId: exerciseId,
        isActive: true
      });
      res.json({
        success: true,
        data: {
          result: all,
        },
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
};
