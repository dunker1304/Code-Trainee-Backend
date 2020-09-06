module.exports = {
  getAllByExerciseId: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let languages = await ProgramLanguage.find().populate("codeSnippets", {
        exerciseId: exerciseId,
        // isActive: true
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
  getAllByExerciseIdPlayground: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let languages = await ProgramLanguage.find().populate("codeSnippets", {
        exerciseId: exerciseId,
        isActive: true
      });
      languages.forEach((language, index) => {
        if (language.codeSnippets.length == 0) {
          languages.splice(index, 1);
        }
      })
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
