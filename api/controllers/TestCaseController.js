module.exports = {
  // save test case
  saveTestCase: async (req, res) => {
    try {
      let { isHidden, dataInput, expectedOuput, exerciseId } = req.body;
      isHidden = !!isHidden;
      exerciseId = Number.parseInt(exerciseId);
      if (!dataInput || !expectedOuput || !Number.isInteger(exerciseId)) {
        res.json({
          success: false,
          data: {},
          code: 1,
        });
        return;
      }
      let testcase = await TestCase.create({
        isHidden,
        input: dataInput,
        expectedOuput,
      }).fetch();
      await Exercise.addToCollection(exerciseId, "testCases").numbers([
        testcase.id,
      ]);
      res.json({
        success: true,
        data: {},
        code: 1,
      });
    } catch (e) {
      res.json({
        success: true,
      });
    }
  },

  // get testcase by id
  getById: async (req, res) => {
    try {
      let testcaseId = req.query.id;
      testcaseId = Number.parseInt(testcaseId);
      if (!testcaseId || !Number.isInteger(testcaseId)) {
        res.json({
          success: false,
          code: 1,
        });
        return;
      }
      let testcase = await TestCase.findOne({ id: testcaseId });
      res.json({
        success: true,
        data: {},
      });
    } catch (e) {
      res.json({
        success: false,
        code: 1,
      });
    }
  },

  // update testcase
  updateTestCase: async (req, res) => {
    try {
      let { isHidden, dataInput, expectedOuput, testcaseId } = req.body;
      isHidden = !!isHidden;
      testcaseId = Number.parseInt(testcaseId);
      if (
        !dataInput ||
        !expectedOuput ||
        !testcaseId ||
        Number.isInteger(testcaseId)
      ) {
        res.json({
          success: false,
          code: 1,
        });
        return;
      }
      let testcase = await TestCase.updateOne({ id: testcaseId }).set({
        isHidden,
        input: dataInput,
        expectedOuput,
      });

      res.json({
        success: true,
        data: {},
      });
    } catch (e) {
      res.json({
        success: false,
        code: 1,
      });
    }
  },
};
