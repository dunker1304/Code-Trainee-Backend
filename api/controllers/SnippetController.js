module.exports = {
  // only update or create if not exist
  updateOrCreateSnippet: async (req, res) => {
    try {
      let {
        supportedLanguages, // [{languageId, sampleCode, isActive}]
        exerciseId,
      } = req.body;
      let promiseArr = supportedLanguages.map(async (e) => {
        let snippet = await CodeSnippet.findOrCreate(
          {
            exerciseId: exerciseId,
            programLanguageId: e.languageId,
          },
          {
            exerciseId: exerciseId,
            programLanguageId: e.languageId,
            sampleCode: e.sampleCode,
            isActive: e.isActive,
          }
        );
        return CodeSnippet.updateOne({
          id: snippet.id,
        }).set({
          isActive: e.isActive,
          sampleCode: e.sampleCode,
        });
      });
      await Promise.all([...promiseArr]);
      res.json({
        success: true,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },

  getSnippetCode: async (req, res) => {
    try {
      let { userID, exerciseID, languageID } = req.query;
      let snippet = await CodeSnippet.findOne({
        exerciseId: exerciseID,
        programLanguageId: languageID,
      });
      res.json({
        success: true,
        data: snippet,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
};
