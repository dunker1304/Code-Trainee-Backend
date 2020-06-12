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
    let testCase = await TestCase.find({ questionId: 1 })

    //let q = await Question.create({ points: '20', level: 'easy', content: 'You have to count all of elements of array', title: 'Sum of Array'}).fetch();
    //let a = await TestCase.create({ input: '1\n10', expectedOutput: '10', questionId: '1' }).fetch();
    //console.log(a, 'create testcase')

    if (testCase.length == 0) {
      console.log(testCase, 'k co testcase')
      let submitData = {
        'language_id': languageId,
        'source_code': sourceCode,
        'stdin' : `2\n20 10`,
        //'expected_output': '40'
      }
      let submittedResult = await QuestionComponent.submitQuestion(submitData)
      console.log(submittedResult, 'submited result');
      if (submittedResult.data.stdout) {
        submittedResult.data.stdout = submittedResult.data.stdout.toString();
        console.log(Buffer.from(submittedResult.data.stdout, 'utf8'), 'stdout')
      }
      res.send([submittedResult])
    } else {
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
        console.log(testCaseResult, 'testcase duoi')

      }

      res.send(testCaseResult);
    }
  }

};

