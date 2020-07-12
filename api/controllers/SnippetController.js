module.exports = {
  // only update or create if not exit 'sampleCode' field
  updateOrCreateSample: async (req, res) => {
    try {
      let { exerciseId, languageId, sampleCode } = req.body;
      let snippet = await CodeSnippet.findOrCreate(
        {
          exerciseId: exerciseId,
          programLanguageId: languageId,
        },
        {
          exerciseId: exerciseId,
          programLanguageId: languageId,
          sampleCode: sampleCode,
          isActive: false,
        }
      );
      await CodeSnippet.updateOne({
        id: snippet.id,
      }).set({
        sampleCode: sampleCode,
      });
      res.json({
        success: true,
        data: {
          id: snippet.id,
        },
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
  // // only update or create if not exist supported language 'active' field
  updateOrCreateSupportedLanguage: async (req, res) => {
    try {
      let {
        activeLangIds, // array of ids of supported language
        notActiveLangIds, // array of ids of not supported language
        exerciseId,
      } = req.body;
      console.log(req.body);
      let actives = [
        ...activeLangIds.map(async (i) => {
          let snippet = await CodeSnippet.findOrCreate(
            {
              exerciseId: exerciseId,
              programLanguageId: i,
            },
            {
              exerciseId: exerciseId,
              programLanguageId: i,
              sampleCode: "",
              isActive: true,
            }
          );
          await CodeSnippet.updateOne({
            id: snippet.id,
          }).set({
            isActive: true,
          });
        }),
      ];
      let notActives = [
        ...notActiveLangIds.map(async (i) => {
          let snippet = await CodeSnippet.findOrCreate(
            {
              exerciseId: exerciseId,
              programLanguageId: i,
            },
            {
              exerciseId: exerciseId,
              programLanguageId: i,
              sampleCode: "",
              isActive: false,
            }
          );
          await CodeSnippet.updateOne({
            id: snippet.id,
          }).set({
            isActive: false,
          });
        }),
      ];
      await Promise.all([...actives, ...notActives]);
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
    let {
      userID,
      exerciseID, 
      languageID
    } = req.query
    CodeSnippet.findOne({ exerciseId: exerciseID, programLanguageId: languageID})
  }
};
