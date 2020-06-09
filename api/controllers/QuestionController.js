/**
 * QuestionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const QuestionComponent = require('../components/QuestionComponent')
module.exports = {

  submitQuestion: async (req, res) => {
    // call thirty system

    let data = req.body
    let languageId = data.language_id;
    let sourceCode = data.source_code;
    let stdin = data.stdin
    let questionId = data.question_id
    let status = ''
    let submitData = {
      'language_id': languageId,
      'source_code': sourceCode,
      // 'stdin' : stdin,
      // 'expected_output':ele['expectedOutput']
    }

    //get testcase of question
    let testCase = await TestCase.find({ questionId: questionId })

    if (!testCase) {
      res.send({
        'success': true,
        'message': 'Empty testcase!'
      })
    }

    //check testcase
    let testCaseResult = [];
  
    for (let i = 0; i < testCase.length; i++) {
      submitData = {
        'language_id': languageId,
        'source_code': sourceCode,
        'stdin': testCase[i]['input'],
        'expected_output': testCase[i]['expectedOutput']
      }
     
      let submitResult = await QuestionComponent.submitQuestion(submitData);

      // một testcase xảy ra lỗi runtime or compile thì dừng lại ctr và trả ra lỗi
      if(submitResult.success === false) {
        return res.send(submitResult);
      }

      testCaseResult.push(submitResult);
    }

    res.send(testCaseResult);
  }

};

