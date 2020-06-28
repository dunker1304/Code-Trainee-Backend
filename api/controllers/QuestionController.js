/**
 * QuestionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const QuestionComponent = require('../components/QuestionComponent');
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
    let testCase = await TestCase.find({ questionId: 10 })

    //let q = await Question.create({ points: '20', level: 'easy', content: 'You have to count all of elements of array', title: 'Sum of Array'}).fetch();
    //let a = await TestCase.create({ input: '1\n10', expectedOutput: '10', questionId: '1' }).fetch();
    //console.log(a, 'create testcase')

    if (testCase.length == 0) {
      console.log(testCase, 'k co testcase')
      let submitData = {
        'language_id': languageId,
        'source_code': Buffer.from(sourceCode).toString('base64'),
        'stdin' : Buffer.from('abc', 'base64').toString('ascii')
        //'stdin' : `2\n20 10`
        //'expected_output': '40'
      }
      let submittedResult = await QuestionComponent.submitQuestion(submitData)
      console.log(submittedResult, 'submited result');
      if (submittedResult.data.stdout) {
        submittedResult.data.stdout = submittedResult.data.stdout.toString();
        var buf = Buffer.from(submittedResult.data.stdout, 'base64').toString('ascii')
        var buf1 = Buffer.from('abc', 'base64').toString('ascii')
        console.log(buf1, 'stdout')
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
  },

  // get question by id
  get: async (req, res) => {
    let id = req.params.id 

    let question = await Question.find({ id : id });
    res.send(question[0])
  },

  //search question
  searchQuestion :  async (req,res) => {
    try {
          let data  = req.body ? req.body : {}
          let condition = {}
          let condition1 = ``
          let limit = data.limit ? 10 : 10
          let page = data.page ? data.page :1
          let conditionLevelSQL = ``
          let conditiontTagSQL = ``
          let conditiontStatusSQL = ``
          let typeJoin = `left`
          let selectSQL = `Count(DISTINCT a.id) as total`
          let userId = req.user ? req.user : 5
        
          //filter by level
          if(data.level){
             condition = { 'level' : data.level.name}
             conditionLevelSQL = `a.level = '${data.level.name}'`
          }

          //filter by tag
          if(data.tag && data.tag.length > 0) {
             const tagIds = data.tag.map(value => value.id)
             conditionTag = { id : { in : tagIds}}
             conditiontTagSQL = `b.category_id in (${tagIds.toString()})`
          }

          //filter by status
          if(data.status && data.status.id != -1) {
             conditionStatus = { 'idFinished' : data.status.id }     
             conditiontStatusSQL = `c.is_finished = ${data.status.id}`   
             typeJoin = `inner`   
          }

          let SQL = await QuestionComponent.createQuery(selectSQL,typeJoin)
          //condition
          if(conditionLevelSQL) {
             if(condition1) {
                condition1 += ` AND ${conditionLevelSQL}`
             }
             else 
                condition1 = ` WHERE ${conditionLevelSQL}`
          }

          if(conditiontTagSQL) {
            if(condition1) {
               condition1 += ` AND ${conditiontTagSQL}`
            }
            else 
               condition1 = ` WHERE ${conditiontTagSQL}`
         }

         if(conditiontStatusSQL) {
          if(condition1) {
             condition1 += ` AND ${conditiontStatusSQL}`
          }
          else 
             condition1 = ` WHERE ${conditiontStatusSQL}`
       }
       let pagging = ` ORDER BY a.ID ASC LIMIT ${(page-1)*limit},${limit}`
      
       //count
       let SQLCount = SQL + condition1;

       let count = await sails.sendNativeQuery(SQLCount);
       //select 
       selectSQL = `DISTINCT a.*`
      
       SQL = await QuestionComponent.createQuery(selectSQL,typeJoin) + condition1 + pagging
       console.log(SQL)
       let resultSQL = await sails.sendNativeQuery(SQL);
           resultSQL = resultSQL['rows']
       let resultFormated = []
           for(let i=0 ;i < resultSQL.length ; i++){
              let questionId = resultSQL[i]['id']
              let createdBy =  resultSQL[i]['created_by']
              let category = await QuestionCategory.find({questionId : questionId}).populate('categoryId')
                  category = category.map(value => {
                    return {id : value['categoryId']['id'],name:value['categoryId']['name']}
                  })
             let isWishList = await WishList.findOne({userId : userId,questionId:questionId}) 
             let author = await User.findOne({where : {id : createdBy} ,select : ['id','displayName']})
              let tmp = {...resultSQL[i]}
                  tmp['categories'] = category
                  if(isWishList) {
                    tmp['isWishList'] = true
                  }
                  else 
                    tmp['isWishList'] = false

                  if(author)
                    tmp['author'] =   author
              resultFormated.push(tmp)
               
           }
          
          return res.send({
            success : true ,
            data : resultFormated,
            total : count['rows'][0] && count['rows'][0]['total'] ? count['rows'][0]['total']:0
          })
    } catch (error) {
         console.log(error)
         return res.send({
           success : false,
           message : error.message
         })
    }
   

  },

  //add question to wishList
  addWishList : async (req,res) => {

    try {
      let {userId , questionId } = req.body
       userId = 5;
       WishList.findOrCreate({userId , questionId },{userId , questionId })
      .exec(async(err, wishList, wasCreated)=> {
        if (err) { return res.serverError(err); }
      
        if(wasCreated) {
          res.send({
            success : true,
            message : 'Add To WishList Success!',
            data : wishList
         })
        }
        else {
          res.send({
            success : false,
            message : 'This Question already exist in WishList'
         })
        }
      })
      
    } catch (error) {
      res.send({
        success : false,
        message :error
     })
     
    }
     
  },

  //remove question to wishlist

  removeWishList : async (req,res) => {
     try {
       let { questionId  } = req.body
       let userId = req.user ? req.user : 5

      let wishlist =  await WishList.destroyOne({questionId:questionId , userId : userId})

       return res.send({
         success : true,
         message : 'Remove Successfully!',
         data : wishlist
       })

       
     } catch (error) {
       console.log(error)
       return res.send({
         success : false,
         message : 'Remove Fail!'
       })
     }
  },

  //get category
  getCategory : async (req,res) => {
     try {
      let listCategory = await Category.find();
      return res.send({
        success : true,
        data : listCategory
      })
     } catch (error) {
        return res.send({
          success : false,
          message : error.message
        })
     }

  }

};

