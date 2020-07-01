/**
 * QuestionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
//const responseTemplate = require("../components/ResponseTemplate");
const QuestionComponent = require("../components/QuestionComponent")
var Purifier = require("html-purify");
var purifier = new Purifier();
module.exports = {
  submitQuestion: async (req, res) => {
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

    //get testcase of question
    let testCase = await TestCase.find({ questionId: 1 })

    //let q = await Question.create({ points: '20', level: 'easy', content: 'You have to count all of elements of array', title: 'Sum of Array'}).fetch();
    //let a = await TestCase.create({ input: '1\n10', expectedOutput: '10', questionId: '1' }).fetch();
    //console.log(a, 'create testcase')

    if (testCase.length == 0) {
      console.log(testCase, "k co testcase");
      let submitData = {
        language_id: languageId,
        source_code: Buffer.from(sourceCode).toString("base64"),
        stdin: Buffer.from("abc", "base64").toString("ascii"),
        //'stdin' : `2\n20 10`
        //'expected_output': '40'
      }
      let submittedResult = await QuestionComponent.submitQuestion(submitData)
      console.log(submittedResult.message.response, 'submited result');
      if (submittedResult.data.stdout) {
        submittedResult.data.stdout = submittedResult.data.stdout.toString();
        var buf = Buffer.from(submittedResult.data.stdin, 'base64').toString('ascii')
        var buf1 = Buffer.from('<Buffer 8b>', 'utf8')
        console.log(buf, 'stdout')
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

        let submitResult = await QuestionComponent.submitQuestion(submitData);

        // một testcase xảy ra lỗi runtime or compile thì dừng lại ctr và trả ra lỗi
        if (submitResult.success === false) {
          return res.send(submitResult);
        }

        testCaseResult.push(submitResult);

      }

      res.send(testCaseResult);
    }
  },

  // get question by id
  getQuestionById: async (req, res) => {
    try {
      let questionId = req.query.id;
      questionId = Number.parseInt(questionId);
      if (!questionId || !Number.isInteger(questionId)) {
        //res.json(responseTemplate(400));
        res.send({ message: 'Invalid question id!' })
        return;
      }
      let count = await Question.count();
      let question = await Question.findOne({ id: questionId });
      //res.json(responseTemplate(200, question));
      let testCases
      if (question) {
        testCases = await TestCase.find({ questionId: question.id })
      }
      res.send({ question: question, testCases: testCases, total: count })
    } catch (e) {
      //res.json(responseTemplate(500));
      res.send({ message: 'Error!' })
    }
  },

  getRandom: async (req, res) => {
    let question = await Question.count()
                          .then(count => Question.find().limit(1).skip(parseInt(Math.random() * count)))
    console.log(question)
  },

  // save question
  saveQuestion: async (req, res) => {
    try {
      let {
        questionContent,
        questionTitle,
        questionPoints,
        questionLevel,
      } = req.body;
      if (
        !questionContent ||
        !questionTitle ||
        !questionLevel ||
        !Number.isInteger(questionPoints)
      ) {
        res.json(responseTemplate(400));
        return;
      }
      questionContent = purifier.purify(questionContent);
      let question = await Question.create({
        points: questionPoints,
        level: questionLevel,
        content: questionContent,
        title: questionTitle,
        createdBy: 1,
      }).fetch();

      res.json(
        responseTemplate(200, {
          id: question.id,
        })
      );
    } catch (e) {
      res.json(responseTemplate(500));
    }
  },

  // save question basic information
  updateQuestion: async (req, res) => {
    try {
      let {
        questionId,
        questionContent,
        questionTitle,
        questionPoints,
        questionLevel,
      } = req.body;
      questionId = Number(questionId);
      questionPoints = Number(questionPoints);
      if (
        !questionContent ||
        !questionTitle ||
        !questionLevel ||
        !Number.isInteger(questionPoints) ||
        !Number.isInteger(questionId)
      ) {
        res.json(responseTemplate(400));
        return;
      }
      questionContent = purifier.purify(questionContent);
      let updatedQuesiton = await Question.updateOne({ id: questionId }).set({
        points: questionPoints,
        level: questionLevel,
        content: questionContent,
        title: questionTitle,
      });
      res.json(
        responseTemplate(200, {
          id: updatedQuesiton.id,
        })
      );
    } catch (e) {
      res.json(responseTemplate(500));
    }
  },
};
