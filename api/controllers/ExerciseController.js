/**
 * ExerciseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ExerciseComponent = require("../components/ExerciseComponent");
var Purifier = require("html-purify");
var purifier = new Purifier();
const moment = require("moment");
const CONSTANTS = require("../../config/custom").custom;
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
    let testCase = await TestCase.find({ exerciseId: questionId });

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
          return res.send([submitResult]);
        }

        testCaseResult.push(submitResult);
      }

      res.send(testCaseResult);
    }
  },

  // get exercise by id
  getExerciseById: async (req, res) => {
    //let q = await Exercise.create({ points: '20', level: 'easy', content: 'You have to count all of elements of array', title: 'Sum of Array'}).fetch();
    //let a = await TestCase.create({ input: '6\n1 2 3 4 5 6', expectedOutput: '21', exerciseId: '1', isHidden: true }).fetch();
    //let l = await ProgramLanguage.create({ name: 'C', code: 53, createdBy: 3 })
    //let s = await CodeSnippet.create({ sampleCode: 'System.out.println("asd")', exerciseId: '1', programLanguageId: 2, createdBy: 3 })
    try {
      let id = req.query.id;
      id = Number.parseInt(id);
      if (!id || !Number.isInteger(id)) {
        res.send({ success: false, message: "Invalid exercise id!" });
        return;
      }
      let count = await Exercise.count();
      let exercise = await Exercise.findOne({ id: id, isApproved: true, isDeleted: false });
      let testCases;
      if (exercise) {
        testCases = await TestCase.find({ exerciseId: exercise.id });
      }
      res.send({success: true, question: exercise, testCases: testCases, total: count });
    } catch (e) {
      res.send({ success: false, message: e, code: 500 });
    }
  },

  getVoteExercise: async (req, res) => {
    try {
      let userID = req.query.userID
      let questionID = req.query.questionID
      let vote = await ExerciseVote.findOne({ userId: userID, exerciseId: questionID})
      res.send({ success: true, exerciseVote: vote })
    } catch (e) {
      res.send({ success: false, message: e })
    }
  },

  reactExercise: async (req, res) => {
    try {
      let userID = req.body.userID
      let exerciseID = req.body.exerciseID
      let status = req.body.status
      let vote = await ExerciseVote.findOne({ userId: userID, exerciseId: exerciseID })
      let result;
      let updatedExercise = await Exercise.findOne({ id: exerciseID });
      if (vote) {
        if (status == 'like' && vote.statusVote == 1) {
          result = await ExerciseVote.updateOne({ id: vote.id })
                                     .set({ statusVote: 0 })
          updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                          .set({ like: updatedExercise.like - 1 })
        } else if (status == 'like' && (vote.statusVote == 0 || vote.statusVote == -1)) {
          result = await ExerciseVote.updateOne({ id: vote.id })
                                     .set({ statusVote: 1 })
          if (vote.statusVote == 0) {
            updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                     .set({ like: updatedExercise.like + 1 })
          } else {
            updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                     .set({ like: updatedExercise.like + 1, dislike: updatedExercise.dislike - 1 })
          }
          
        } else if (status == 'dislike' && vote.statusVote == -1) {
          result = await ExerciseVote.updateOne({ id: vote.id })
                                     .set({ statusVote: 0 })
          updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                     .set({ dislike: updatedExercise.dislike - 1 })
        } else {
          result = await ExerciseVote.updateOne({ id: vote.id })
                                     .set({ statusVote: -1 })
          if (vote.statusVote == 0) {
            updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                          .set({ dislike: updatedExercise.dislike + 1 })
          } else {
            updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                          .set({ dislike: updatedExercise.dislike + 1, like: updatedExercise.like - 1 })
          }
          
        }
      } else {
        if (status == 'like') {
          result = await ExerciseVote.create({ userId: userID, exerciseId: exerciseID, statusVote: 1 }).fetch();
          updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                     .set({ like: updatedExercise.like + 1 })
        } else {
          result = await ExerciseVote.create({ userId: userID, exerciseId: exerciseID, statusVote: -1 }).fetch();
          updatedExercise = await Exercise.updateOne({ id: exerciseID })
                                     .set({ dislike: updatedExercise.dislike + 1 })
        }
      }
      res.send({ success: true, resultVote: result, updatedExercise: updatedExercise })
    } catch (error) {
      res.send({ success: false, message: error })
    }
  },

  //dunk
  getAllSubmissions: async (req, res) => {
    try {
      let userID = parseInt(req.query.userID);
      let exerciseID = parseInt(req.query.exerciseID)
      if (!userID || !exerciseID || !Number.isInteger(userID) || !Number.isInteger(exerciseID)) {
        res.send({ success: false, message: "Invalid ID" })
      } else {
        let submissions = await TrainingHistory.find({ exerciseId: exerciseID, userId: userID })
        console.log(submissions, 'all submissions')
        res.send({ success: true, submissions: submissions })
      }
    } catch (error) {
      res.send({ success: false, message: error.message, code: 500 })
    }
  },

  submitSolution: async (req, res) => {
    try {
      let { question, testcases, answer, language, userID } = req.body;
      console.log(req.body, "solution");
      let status = "Accepted";
      testcases.forEach((testcase) => {
        if (testcase.data.description != "Accepted") {
          status = testcase.data.status.description;
          return;
        }
      });
      let history = await TrainingHistory.create({
        userId: userID || 3 ,
        exerciseId: question.id,
        status: status,
        answer: answer,
        programLanguageId: language,
        isFinished: status == "Accepted" ? true : false,
      }).fetch();

      res.send({ success: true, solution: history });
    } catch (error) {
      res.send({ success: false, message: error, code: 500 });
    }
  },
  // get basic information
  getBasicInfoById: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let exercise = await Exercise.findOne({ id: exerciseId, isDeleted: false }).populate(
        "tags"
      );
      if(!exercise) {
        throw new Error('already deleted')
      }
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
    try {
      let count = await Exercise.count({ isDeleted: false, isApproved: true })
      let random = parseInt(Math.random() * count)
      let allExercise = await Exercise.find({ isDeleted: false, isApproved: true })
      res.send({
        success: true,
        data: allExercise[random]
      });
    } catch (err) {
      res.send({ success: false, message: err })
    }
    
  },

  // create exercise
  createExercise: async (req, res) => {
    try {
      let { content, title, points, level, tags, createdBy } = req.body;
      console.log('createdBy', createdBy)
      tags.push("#"); // default 1 tags
      let mappingTags = await Promise.all(
        [ ... new Set(tags) ].map(async (e) => {
          return Tag.findOrCreate(
            {
              name: e,
            },
            {
              name: e,
            }
          );
        })
      );
      let mappingTagIds = [...new Set(mappingTags)].map((e) => e.id);
      content = purifier.purify(content); // escape XSR
      let exercise = await Exercise.create({
        points,
        level,
        content,
        title,
        createdBy
      }).fetch();
      await Exercise.addToCollection(exercise.id, "tags").members(
        mappingTagIds
      );
      // default always support language id 1
      let snippet = await CodeSnippet.create({
        exerciseId: exercise.id,
        programLanguageId: 1,
        sampleCode: "",
        isActive: true,
      }).fetch();
      await Exercise.addToCollection(exercise.id, "codeSnippets").members([snippet.id]);
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
      let { id, content, title, points, level, tags } = req.body;
      console.log("tags", tags);
      tags.push("#"); // default 1 tags
      let mappingTags = await Promise.all(
        [... new Set(tags)].map(async (e) => {
          return Tag.findOrCreate(
            {
              name: e,
            },
            {
              name: e,
            }
          );
        })
      );
      let mappingTagIds = [...new Set(mappingTags)].map((e) => e.id);
      id = Number(id);
      points = Number(points);
      content = purifier.purify(content);
      let updatedExercise = await Exercise.updateOne({ id: id }).set({
        points: points,
        level: level,
        content: content,
        title: title,
      });
      await Exercise.replaceCollection(id, "tags").members(mappingTagIds);
      res.json({
        success: true,
        data: {
          id: updatedExercise.id,
        },
      });
    } catch (e) {
      console.log(e)
      res.json({
        success: false,
        data: {},
        code: 1,
      });
    }
  },

  //search exercise
  searchExercise: async (req, res) => {
    try {
          let data  = req.body ? req.body : {}
          let condition = {}
          let condition1 = ``
          let limit = data.limit ? data.limit : 20
          let page = data.page ? data.page :1
          let conditionLevelSQL = ``
          let conditiontTagSQL = ``
          let conditiontStatusSQL = ``
          let conditionKeySearch = ``
          let typeJoin = `left`
          let selectSQL = `Count(DISTINCT a.id) as total`
          let userId = req.body.userId ? req.body.userId : null
        
          //filter by level
          if(data.level){
             condition = { 'level' : data.level.name}
             conditionLevelSQL = `a.level = '${data.level.name}'`
          }

          //filter by tag
          if(data.tag && data.tag.length > 0) {
             const tagIds = data.tag.map(value => value.id)
             conditionTag = { id : { in : tagIds}}
             conditiontTagSQL = `b.tag_id in (${tagIds.toString()})`
          }

          //filter by status
          if(data.status && data.status.id != -1) {
             conditionStatus = { 'idFinished' : data.status.id }     
             conditiontStatusSQL = `c.is_finished = ${data.status.id}`   
             typeJoin = `inner`   
          }

          //filter by key_Search
          if(data.term && data.term.name) {
            conditionKeySearch = ` MATCH (title,content) AGAINST ('${data.term.name}' IN NATURAL LANGUAGE MODE)`
          }

          let SQL = await ExerciseComponent.createQuery(selectSQL,typeJoin)
          //condition
          if(conditionLevelSQL) {
            // if(condition1) {
                condition1 += ` AND ${conditionLevelSQL}`
            //  }
            //  else 
            //     condition1 = ` WHERE ${conditionLevelSQL}`
          }

          if(conditiontTagSQL) {
          //  if(condition1) {
               condition1 += ` AND ${conditiontTagSQL}`
            // }
            // else 
            //    condition1 = ` WHERE ${conditiontTagSQL}`
         }

         if(conditiontStatusSQL) {
         // if(condition1) {
             condition1 += ` AND ${conditiontStatusSQL}`
          // }
          // else 
          //    condition1 = ` WHERE ${conditiontStatusSQL}`
        }

        if(conditionKeySearch) {
          condition1 += ` AND ${conditionKeySearch}`
        }

       let pagging = ` ORDER BY a.ID ASC LIMIT ${(page-1)*limit},${limit}`
      
       //count
       let SQLCount = SQL + condition1;

       let count = await sails.sendNativeQuery(SQLCount);
       //select 
       selectSQL = `DISTINCT a.*`
      
       SQL = await ExerciseComponent.createQuery(selectSQL,typeJoin) + condition1 + pagging
       console.log(SQL)
       let resultSQL = await sails.sendNativeQuery(SQL);
           resultSQL = resultSQL['rows']
       let resultFormated = []
           for(let i=0 ;i < resultSQL.length ; i++){
              let questionId = resultSQL[i]['id']
              let createdBy =  resultSQL[i]['created_by']
              let category = await ExerciseTag.find({exerciseId : questionId}).populate('tagId')
                  category = category.map(value => {
                    return {id : value['tagId']['id'],name:value['tagId']['name']}
                  })
             let isWishList = userId ? await WishList.findOne({userId : userId,exerciseId:questionId}) :null
             let author = await User.findOne({where : {id : createdBy} ,select : ['id','displayName']})
             let countComment = await Comment.count({where :  {exerciseId : resultSQL[i]['id'] }})
              let tmp = {...resultSQL[i]}
                  tmp['categories'] = category
                  if(isWishList) {
                    tmp['isWishList'] = true
                  }
                  else 
                    tmp['isWishList'] = false

                  if(author)
                    tmp['author'] =   author
                    tmp['countComment'] = countComment;
              resultFormated.push(tmp)
               
           }
          
          return res.send({
            success : true ,
            data : resultFormated,
            total : count['rows'][0] && count['rows'][0]['total'] ? count['rows'][0]['total']:0,
            
          })
    } catch (error) {
      console.log(error);
      sails.sentry.captureMessage(error);
      return res.send({
        success: false,
        message: error.message,
        data : []
      });
    }
  },

  //add question to wishList
  addWishList: async (req, res) => {
    try {
      let {userId , questionId } = req.body
       userId = req.user['id'] ;
  
       WishList.findOrCreate({userId : userId , exerciseId : questionId},{userId : userId , exerciseId : questionId})
      .exec(async(err, wishList, wasCreated)=> {
        if (err) { return res.serverError(err); }
      
     

        if (wasCreated) {
         return res.send({
            success: true,
            message: "Add To WishList Success!",
            data: wishList,
          });
        } else {
          return res.send({
            success: false,
            message: "This Question already exist in WishList",
          });
        }
      });
    } catch (error) {
      console.log(error)
      return res.send({
        success: false,
        message: error,
      });
    }
  },

  //remove question to wishlist

  removeWishList: async (req, res) => {
    try {
      let { exerciseId, typeWishList } = req.body;
      let userId = req.user['id'];

      let wishlist = await WishList.destroyOne({
        exerciseId: exerciseId,
        userId: userId,
      });

      return res.send({
        success: true,
        message: "Remove Successfully!",
        data: wishlist,
      });
    } catch (error) {
      console.log(error);
      return res.send({
        success: false,
        message: "Remove Fail!",
      });
    }
  },

  //get category
  getTag: async (req, res) => {
    try {
      let listCategory = await Tag.find();
      return res.send({
        success: true,
        data: listCategory,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  },

  //get submition by userId
  getSubmmitionByUserId: async (req, res) => {
    try {
      let { userId } = req.params;

      // limit time
      let endDate = moment().format("YYYY-MM-DD");
      let startDate = moment().subtract(270, "d").format("YYYY-MM-DD"); // 9 tháng

      let submitions = await TrainingHistory.find({
        where: {
          userId: userId,
          createdAt: { "<=": endDate, ">=": startDate },
        },
      });

      let results = ExerciseComponent.getRange(270).map((index) => {
        return {
          date: moment().subtract(index, "d").format("YYYY-MM-DD"),
          count: 0,
        };
      });

      submitions.forEach((element) => {
        let date = moment(element.createdAt).format("YYYY-MM-DD");
        let index = results.findIndex((x) => x.date == date);

        if (index == -1) {
          results.push({ date: date, count: 1 });
        } else {
          results[index].count++;
        }
      });

      return res.send({
        success: true,
        data: results,
      });
    } catch (error) {
      return res.send({
        success: false,
        data: [],
        error: CONSTANTS.API_ERROR,
      });
    }
  },

  //get 5 Most recent submissions
  getMostRecentSubmission: async (req, res) => {
    try {
      let { userId } = req.params;

      let submissions = await TrainingHistory.find({
        where: { userId: userId },
        sort: "createdAt DESC",
        limit: 5,
      }).populate('exerciseId').populate('programLanguageId')

      let result = []

      submissions.forEach((ele,index)=> {
         let item = {
           name : ele['exerciseId']['title'],
           language : ele['programLanguageId']['name'],
           status : ele['status']

         }

         result.push(item)
      })

      return res.send({
        success : true , 
        data : result
      })
     } catch (error) {
       return res.send({
         success : false,
         data : [],
         error : CONSTANTS.API_ERROR
       })
     }
    },

  getWishList : async ( req,res )=> {
     try {
    
      let userId =  req.user['id'] 

      let listWishList = await WishList.find({ userId : userId}).populate('exerciseId')

      return res.send({
        success: true,
        data: listWishList,
      });
    } catch (error) {
      console.log(error);
      return res.send({
        success: false,
        error: CONSTANTS.API_ERROR,
        data: [],
      });
    }
  },
  // get list exercise by owner
  getByOwner: async (req, res) => {
    try {
      let { ownerId } = req.params;
      console.log('ownerId', ownerId)
      let exercises = await Exercise.find({
        where: {
          createdBy: ownerId,
          isDeleted: false,
        },
        sort: "updatedAt DESC",
      });
      res.json({
        success: true,
        data: exercises,
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },
 
  // delete exercise
  deleteExercise: async (req, res) => {
    try {
      let { id } = req.body;
      let deletedExercise = await Exercise.updateOne({
        id: id,
      }).set({
        isDeleted: true,
      });
      console.log(id, deletedExercise, 'delete ex');
      res.json({
        success: true,
        data: {
          id: deletedExercise.id,
        },
      });
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },

  // get all submission_quynhkt
  getAllSubmission : async(req,res)=> {
    try {
      sails.sockets.broadcast('artsAndEntertainment', 'foo', { greeting: 'Hola!' })
      let userId = req.query.userId ? req.query.userId : null;
    
      let listSubmission = await TrainingHistory.find({ where : {userId : userId ,  isFinished : 1}}).populate('programLanguageId').populate('exerciseId')
      let totalSub = await TrainingHistory.count({ where : {userId : userId , isFinished : 1}})
      let result = []
      listSubmission.forEach(ele => {
         let item = {
           id : ele['id'],
           time :  moment(ele['createdAt']).format("YYYY-MM-DD"),
           exercise : ele['exerciseId']['title'],
           status : ele['status'],
           runtime : ele['timeNeeded'],
           language : ele['programLanguageId']['name']
         }
         result.push(item)
      });
     


      return res.send({
        success : true,
        data : {
          submission : result,
          total : totalSub
        }
      })
    } catch (error) {
      console.log(error)
      return res.send({
        success : false,
        data : {
          submission : [],
          total : 0
        },
        error: CONSTANTS.API_ERROR
      })
    }
  },

  //get submission by Id 
  getSubmissionById : async ( req , res) => {
    try {
     
      console.log(await sails.sockets.broadcast('artsAndEntertainment', 'foo', { greeting: 'Hola!' }))
      let subId = req.params.subId
      
      //if teacher -> get submission if your exercise theirr created
      let sub = await TrainingHistory.findOne({id : subId}).populate('programLanguageId').populate('exerciseId');
      let result  = {}
      if(sub) {
        result = {
          id : sub['id'],
          exercise : {
            id : sub['exerciseId']['id'],
            title : sub['exerciseId']['title']
          },
          language : {
            id : sub['programLanguageId']['id'],
            name : sub['programLanguageId']['name']
          },
          answer : sub['answer'],
          createdAt : moment(sub['createdAt']).format("YYYY-MM-DD"),
          userId : sub['userId'],
          status : sub['status']
          
        }
      }
      return res.send({
        success : true,
        data: result
      })
      
    } catch (error) {
      console.log(error)
      return res.send({
        success : false,
        error : 1,
        data : {}
      })
    }
  },    
  getExerciseNeedApproval: async (req, res) => {
    try {
      let exerciseNeedApproval = await Exercise.find({
        where: {
          isApproved: false,
          isDeleted: false,
        },
        sort: "updatedAt DESC",
      });
      res.json({
        success: true,
        data: exerciseNeedApproval,
      })
    } catch (e) {
      res.json({
        success: false,
      });
      console.log(e);
    }
  },

  updateExerciseNeedApproval: async (req, res) => {
    try{
      let {id} = req.body;
      let updatedExercise = await Exercise.updateOne({
        id: id,
      }).set({
        isApproved: true
      })
      res.json({
        success: true,
        data: {id: updatedExercise.id},
      })

    } catch(e) {
      res.json({
        success: false,
      })
      console.log(e)
    }
  }
};
