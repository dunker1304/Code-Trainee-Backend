/**
 * ExerciseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ExerciseComponent = require("../components/ExerciseComponent");
var Purifier = require("html-purify");
var purifier = new Purifier();
module.exports = {
  submitExercise: async (req, res) => {
    // call thirty system

    let data = req.body;
    let languageId = data.language_id;
    let sourceCode = data.source_code;
    let stdin = data.stdin;
    let questionId = data.question_id;
    let status = "";
    let submitData = {
      language_id: languageId,
      source_code: sourceCode,
      // 'stdin' : stdin,
      // 'expected_output':ele['expectedOutput']
    };

    //get testcase of exercise
    let testCase = await TestCase.find({ exerciseId: 1 });

    //let q = await Exercise.create({ points: '20', level: 'easy', content: 'You have to count all of elements of array', title: 'Sum of Array'}).fetch();
    //let a = await TestCase.create({ input: '1\n10', expectedOutput: '10', exerciseId: '1' }).fetch();
    //console.log(a, 'create testcase')

    if (testCase.length == 0) {
      console.log(testCase, "k co testcase");
      let submitData = {
        language_id: languageId,
        source_code: Buffer.from(sourceCode).toString("base64"),
        stdin: Buffer.from("abc", "base64").toString("ascii"),
        //'stdin' : `2\n20 10`
        //'expected_output': '40'
      };
      let submittedResult = await ExerciseComponent.submitExercise(submitData);
      console.log(submittedResult.message.response, "submited result");
      if (submittedResult.data.stdout) {
        submittedResult.data.stdout = submittedResult.data.stdout.toString();
        var buf = Buffer.from(submittedResult.data.stdin, "base64").toString(
          "ascii"
        );
        var buf1 = Buffer.from("<Buffer 8b>", "utf8");
        console.log(buf, "stdout");
      }
      res.send([submittedResult]);
    } else {
      //check testcase
      let testCaseResult = [];

      for (let i = 0; i < testCase.length; i++) {
        submitData = {
          language_id: languageId,
          source_code: sourceCode,
          stdin: testCase[i]["input"],
          expected_output: testCase[i]["expectedOutput"],
        };

        let submitResult = await ExerciseComponent.submitExercise(submitData);

        // một testcase xảy ra lỗi runtime or compile thì dừng lại ctr và trả ra lỗi
        if (submitResult.success === false) {
          return res.send(submitResult);
        }

        testCaseResult.push(submitResult);
      }

      res.send(testCaseResult);
    }
  },

  // get exercise by id
  getExerciseById: async (req, res) => {
    try {
      let id = req.query.id;
      id = Number.parseInt(id);
      if (!id || !Number.isInteger(id)) {
        res.send({ message: "Invalid exercise id!" });
        return;
      }
      let count = await Exercise.count();
      let exercise = await Exercise.findOne({ id: id });
      let testCases;
      if (exercise) {
        testCases = await TestCase.find({ exerciseId: exercise.id });
      }
      res.send({ question: exercise, testCases: testCases, total: count });
    } catch (e) {
      res.send({ message: "Error!" });
    }
  },

  // get basic information
  getBasicInfoById: async (req, res) => {
    try {
      let { id } = req.query;
      let exercise = await Exercise.findOne({ id: id });
      res.json({
        success: true,
        data: { ...exercise },
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },

  getRandom: async (req, res) => {
    let exercise = await Exercise.count().then((count) =>
      Exercise.find()
        .limit(1)
        .skip(parseInt(Math.random() * count))
    );
    console.log(exercise);
  },

  // create exercise
  createExercise: async (req, res) => {
    try {
      let { content, title, points, level } = req.body;
      // if (!content || !title || !level || !Number.isInteger(points)) {
      //   res.json({
      //     success: false,
      //     data: {},
      //     code: 1,
      //   });
      //   return;
      // }
      content = purifier.purify(content); // escape XSR
      let exercise = await Exercise.create({
        points,
        level,
        content,
        title,
      }).fetch();

      res.json({
        success: true,
        data: {
          id: exercise.id,
        },
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },

  // save exercise basic information
  updateExercise: async (req, res) => {
    try {
      let { id, content, title, points, level } = req.body;
      id = Number(id);
      points = Number(points);
      // if (
      //   !content ||
      //   !title ||
      //   !level ||
      //   !Number.isInteger(points) ||
      //   !Number.isInteger(id)
      // ) {
      //   res.json({
      //     success: false,
      //     data: {},
      //     code: 1,
      //   });
      //   return;
      // }
      content = purifier.purify(content);
      let updatedExercise = await Exercise.updateOne({ id: id }).set({
        points: points,
        level: level,
        content: content,
        title: title,
      });
      res.json({
        success: true,
        data: {
          id: updatedExercise.id,
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
