module.exports = {
  getAllByExerciseId: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let languages = await ProgramLanguage.find().populate("codeSnippets", {
        exerciseId: exerciseId,
        isActive: true
      });
      res.json({
        success: true,
        data: languages,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
  getAll: async (req, res) => {
    try {
      let languages = await ProgramLanguage.find();
      res.json({
        success: true,
        data: languages,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
};
