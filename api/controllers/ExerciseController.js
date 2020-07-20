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
    let testCase = await TestCase.find({ exerciseId: 1 });

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
      res.send({ success: false, message: e, code: 500 });
    }
  },

  submitSolution: async (req, res) => {
    try {
      let { question, testcases, answer, language } = req.body;
      console.log(req.body, "solution");
      let status = "Accepted";
      testcases.forEach((testcase) => {
        if (testcase.data.description != "Accepted") {
          status = testcase.data.status.description;
          return;
        }
      });
      let history = await TrainingHistory.create({
        userId: 3,
        exerciseId: question.id,
        status: status,
        answer: answer,
        programLanguageId: language,
        isFinished: status == "Accepted" ? true : false,
      });

      res.send({ success: true, solution: history });
    } catch (error) {
      res.send({ success: false, message: error, code: 500 });
    }
  },
  // get basic information
  getBasicInfoById: async (req, res) => {
    try {
      let { exerciseId } = req.params;
      let exercise = await Exercise.findOne({ id: exerciseId }).populate(
        "tags"
      );
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
    return res.send({
      success: true,
      data: exercise[0],
    });
  },

  // create exercise
  createExercise: async (req, res) => {
    try {
      let { content, title, points, level, tags } = req.body;
      console.log("tags", tags);
      tags.push("#"); // default 1 tags
      let mappingTags = await Promise.all(
        tags.map(async (e) => {
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
      let mappingTagIds = [...mappingTags].map((e) => e.id);
      content = purifier.purify(content); // escape XSR
      let exercise = await Exercise.create({
        points,
        level,
        content,
        title,
      }).fetch();
      await Exercise.addToCollection(exercise.id, "tags").members(
        mappingTagIds
      );
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
        tags.map(async (e) => {
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
      let mappingTagIds = [...mappingTags].map((e) => e.id);
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
      let data = req.body ? req.body : {};
      let condition = {};
      let condition1 = ``;
      let limit = data.limit ? 10 : 10;
      let page = data.page ? data.page : 1;
      let conditionLevelSQL = ``;
      let conditiontTagSQL = ``;
      let conditiontStatusSQL = ``;
      let typeJoin = `left`;
      let selectSQL = `Count(DISTINCT a.id) as total`;
      let userId = req.user ? req.user : 5;

      //filter by level
      if (data.level) {
        condition = { level: data.level.name };
        conditionLevelSQL = `a.level = '${data.level.name}'`;
      }

      //filter by tag
      if (data.tag && data.tag.length > 0) {
        const tagIds = data.tag.map((value) => value.id);
        conditionTag = { id: { in: tagIds } };
        conditiontTagSQL = `b.tag_id in (${tagIds.toString()})`;
      }

      //filter by status
      if (data.status && data.status.id != -1) {
        conditionStatus = { idFinished: data.status.id };
        conditiontStatusSQL = `c.is_finished = ${data.status.id}`;
        typeJoin = `inner`;
      }

      let SQL = await ExerciseComponent.createQuery(selectSQL, typeJoin);
      //condition
      if (conditionLevelSQL) {
        if (condition1) {
          condition1 += ` AND ${conditionLevelSQL}`;
        } else condition1 = ` WHERE ${conditionLevelSQL}`;
      }

      if (conditiontTagSQL) {
        if (condition1) {
          condition1 += ` AND ${conditiontTagSQL}`;
        } else condition1 = ` WHERE ${conditiontTagSQL}`;
      }

      if (conditiontStatusSQL) {
        if (condition1) {
          condition1 += ` AND ${conditiontStatusSQL}`;
        } else condition1 = ` WHERE ${conditiontStatusSQL}`;
      }
      let pagging = ` ORDER BY a.ID ASC LIMIT ${(page - 1) * limit},${limit}`;

      //count
      let SQLCount = SQL + condition1;

      let count = await sails.sendNativeQuery(SQLCount);
      //select
      selectSQL = `DISTINCT a.*`;

      SQL =
        (await ExerciseComponent.createQuery(selectSQL, typeJoin)) +
        condition1 +
        pagging;
      console.log(SQL);
      let resultSQL = await sails.sendNativeQuery(SQL);
      resultSQL = resultSQL["rows"];
      let resultFormated = [];
      for (let i = 0; i < resultSQL.length; i++) {
        let questionId = resultSQL[i]["id"];
        let createdBy = resultSQL[i]["created_by"];
        let category = await ExerciseTag.find({
          exerciseId: questionId,
        }).populate("tagId");
        category = category.map((value) => {
          return { id: value["tagId"]["id"], name: value["tagId"]["name"] };
        });
        let isWishList = await WishList.findOne({
          userId: userId,
          exerciseId: questionId,
        });
        let author = await User.findOne({
          where: { id: createdBy },
          select: ["id", "displayName"],
        });
        let tmp = { ...resultSQL[i] };
        tmp["categories"] = category;
        if (isWishList) {
          tmp["isWishList"] = true;
        } else tmp["isWishList"] = false;

        if (author) tmp["author"] = author;
        resultFormated.push(tmp);
      }

      return res.send({
        success: true,
        data: resultFormated,
        total:
          count["rows"][0] && count["rows"][0]["total"]
            ? count["rows"][0]["total"]
            : 0,
      });
    } catch (error) {
      console.log(error);
      return res.send({
        success: false,
        message: error.message,
      });
    }
  },

  //add question to wishList
  addWishList: async (req, res) => {
    try {
      let { userId, questionId } = req.body;
      userId = 5;
      WishList.findOrCreate(
        { userId, exerciseId },
        { userId, exerciseId }
      ).exec(async (err, wishList, wasCreated) => {
        if (err) {
          return res.serverError(err);
        }

        if (wasCreated) {
          res.send({
            success: true,
            message: "Add To WishList Success!",
            data: wishList,
          });
        } else {
          res.send({
            success: false,
            message: "This Question already exist in WishList",
          });
        }
      });
    } catch (error) {
      res.send({
        success: false,
        message: error,
      });
    }
  },

  //remove question to wishlist

  removeWishList: async (req, res) => {
    try {
      let { exerciseId, typeWishList } = req.body;
      let userId = req.user ? req.user : 5;

      let wishlist = await WishList.destroyOne({
        exerciseId: exerciseId,
        userId: userId,
        type: typeWishList,
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
      })
        .populate("programLanguageId")
        .populate("exerciseId");
      let results = [];
      submissions.forEach((ele) => {
        results.push({
          key: ele.id,
          name: ele["exerciseId"]["title"],
          language: ele["programLanguageId"]["name"],
          status: ele["status"] ? ele["status"] : "Wrong Answers",
        });
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

  addTypeWishList: async (req, res) => {
    try {
      let { name } = req.body;
      let userId = req.user && req.user["id"] ? req.user["id"] : 5;

      let type = {
        name: name,
        createdBy: userId,
      };

      let result = await TypeWishList.create(type).fetch();
      return res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res.send({
        success: false,
        data: {},
        message: error,
      });
    }
  },

  getWishListByType: async (req, res) => {
    try {
      let { type } = req.params;

      let userId = req.user && req.user["id"] ? req.user["id"] : 5;

      let listWishList = await WishList.find({
        type: type,
        userId: userId,
      }).populate("exerciseId");

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

  getTypeWishList: async (req, res) => {
    try {
      let userId = req.user && req.user["id"] ? req.user["id"] : 5;
      let listTypeWishList = await TypeWishList.find({ createdBy: userId });

      return res.send({
        success: true,
        data: listTypeWishList,
      });
    } catch (error) {
      return res.send({
        success: false,
        data: [],
        error: CONSTANTS.API_ERROR,
      });
    }
  },

  // get list exercise by owner
  getByOwner: async (req, res) => {
    try {
      let { ownerId } = req.query;
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
};
