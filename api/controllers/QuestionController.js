/**
 * QuestionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const CUSTOM = require('../../config/custom').custom
const axios = require('axios');
const QuestionComponent = require('../components/QuestionComponent')
module.exports = {
  
    submitQuestion : async (req,res) => {
       // call thirty system

       let data = req.body
       let languageId= data.language_id;
       let sourceCode = data.source_code;
       let stdin = data.stdin
       let questionId = data.question_id
       let status = ''
       let result = {}

       //get testcase of question
       let testCase = []

       let submitData = {
           'language_id' : languageId,
           'source_code' : sourceCode,
           'stdin' : stdin
       }

      
       
    }
 
};
    
