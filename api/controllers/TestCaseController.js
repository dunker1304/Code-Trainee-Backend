module.exports = {
  // save test case
  createTestCase: async (req, res) => {
    try {
      let { isHidden, dataInput, expectedOutput, exerciseId } = req.body;
      isHidden = !!isHidden;
      exerciseId = Number.parseInt(exerciseId);

      let testcase = await TestCase.create({
        isHidden,
        input: dataInput,
        expectedOutput,
        exerciseId: exerciseId,
      }).fetch();

      res.json({
        success: true,
        data: { id: testcase.id },
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
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
      console.log(e);
    }
  },

  // update testcase
  updateTestCase: async (req, res) => {
    try {
      let { isHidden, input, output, id } = req.body;
      isHidden = !!isHidden;
      id = Number.parseInt(id);

      let testcase = await TestCase.updateOne({ id: id }).set({
        isHidden: isHidden,
        input: input,
        expectedOutput: output,
      });

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

  // delete test case
  deleteTestcase: async (req, res) => {
    try {
      let { id } = req.body;
      let delRecord = await TestCase.destroy({ id: id }).fetch();
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
  // pagination
  getByExercise: async (req, res) => {
    try {
      let { exerciseId, page, limit } = req.query;
      // page = page || 1;
      // limit = limit || 10;
      let skip = (page - 1) * limit;
      let result = await TestCase.find({
        where: { exerciseId: exerciseId },
        // limit: limit,
        // skip: skip,
        sort: "createdAt DESC",
      });
      res.json({
        success: true,
        data: {
          result: result,
        },
      });
    } catch (e) {
      res.json({ success: false });
      console.log(e);
    }
  },
};
