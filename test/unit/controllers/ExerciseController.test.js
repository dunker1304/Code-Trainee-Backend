var supertest = require('supertest')
const { expect } = require('chai');
const JWT = require('jsonwebtoken');
const ExerciseComponent = require('../../../api/components/ExerciseComponent');
const CONSTANTS = require('../../../config/custom').custom

describe('Exercise Controller Testing', () => {

  // beforeEach(done => {
  //   var newExercise = {
  //     id: 1,
  //     points: 50,
  //     level: 'easy',
  //     isApproved: true,
  //     content: '<h2>You have to count all of elements of array</h2>',
  //     title: 'Sum of array'
  //   }

  //   var newUser = {
  //     id: 1,
  //     username: 'dunker1304@gmail.com',
  //     password: '$2a$10$VgUOuxCEdjqCBdnI4gvFxefSFaIhhCTrTVsxxfW.WJTttpybibaCu',
  //     isLoginLocal: true,
  //     status: 1
  //   }

  //   var newHistory = {
  //     id: 1,
  //     userId: 1,
  //     exerciseId: 1,
  //     status: "Accepted",
  //     answer: `asasd`,
  //     programLanguageId: 3
  //   }
  //   User.create(newUser).then(() => {
  //     Exercise.create(newExercise).then(() => {
  //       TrainingHistory.create(newHistory).then(() => {
  //         done()
  //       })
  //     })
  //   })
    
  // });

  // afterEach(done => {
  //   Exercise.destroy({}).then(() => {
  //     TrainingHistory.destroy({}).then(() => {
  //       done()
  //     })
  //   })
    
  // })

  it('# GET EXERCISE BY ID', async () => {

    let exercise = await Exercise.find({isApproved : 'accepted' , isDeleted : 0}).limit(1);
    let res = await supertest(sails.hooks.http.app)
      .get(`/api/exercise?id=${exercise[0]['id']}`)
    expect(res.body.success).to.equal(true)
    expect(res.body.total).to.be.an('Number')
  })

  it('# POST SUBMISSION', (done) => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/submissions')
      .send({
        language_id: 63,
        source_code: `console.log('a')`,
        stdin: '1',
        expected_output: 'a',
        question_id: exercise[0]['id']
      })
      .end((err, res) => {
        expect(res.body).to.be.an('Array')
        done()
      })
    })
  })

  it('# GET ALL SUBMISSION BY USER', done => {
      supertest(sails.hooks.http.app)
      .get('/api/submissions/all?userID=1&exerciseID=1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })

  })

  it('# SUBMIT SOLUTION', async () => {

    let user = await User.find({}).limit(1);
    let programLanguage = await ProgramLanguage.find({}).limit(1)
    let res = await supertest(sails.hooks.http.app)
      .post('/api/solution')
      .send({
        question: {
          createdAt: '2020-07-02T08:22:48.000Z',
          updatedAt: '2020-07-22T03:01:38.000Z',
          id: 1,
          points: 20,
          level: 'easy',
          isDeleted: false,
          isApproved: 'rejected',
          like: 0,
          dislike: 0,
          content: '<h2>You have to count all of elements of array</h2>',
          title: 'Sum of Array',
          createdBy: 3
        },
        testcases: [
          { message: '', success: true, code: '', data: {
            compile_output: null,
            expected_output: "10",
            memory: 7012,
            message: null,
            status: {
              description: "Accepted",
              id: 3
            },
            description: "Accepted",
            id: 3,
            __proto__: Object,
            stderr: null,
            stdin: "1↵10",
            stdout: "10↵",
            time: "0.067",
            token: "3b5545a4-357d-4ee6-9569-ed337c3f5dce"
          } },
        ],
        answer: 'azsdasd',
        language: programLanguage[0]['id'],
        userID: user[0]['id']
      })
      expect(res.body.success).to.equal(true)
  })

  it('# GET RANDOM EXERCISE', done => {
      supertest(sails.hooks.http.app)
      .get('/api/exercise/random')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
  })

  it('# GET INFO EXERCISE', done => {
    Exercise.find({isDeleted : 0}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get(`/api/exercise/basic-info/${exercise[0]['id']}?userId=${exercise[0]['createdBy']}`)
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# CREATE EXERCISE', async() => {
     let user = await User.find({}).limit(4);
     let language = await ProgramLanguage.find({}).limit(1)
      let res = await supertest(sails.hooks.http.app)
      .post('/api/exercise/create')
      .send({
        content: 'test exercise',
        title: 'title test',
        points: 50,
        level: 'easy',
        tags: ['#'],
        languages : [ { id : language[0]['id'], sampleCode : '', isActive : true}],
        reviewerIds : [user[0]['id'],user[1]['id'],user[2]['id']],
        createdBy : user[3]['id'],
        testcases :[]

      })
      expect(res.body.success).to.equal(true)
  })

  it('# UPDATE EXERCISE', async() => {
    let exercise = await Exercise.find({isDeleted : 0}).limit(1);
    let user = await User.find({}).limit(4);
    let language = await ProgramLanguage.find({}).limit(1)

     let res = await supertest(sails.hooks.http.app)
      .post('/api/exercise/update')
      .send({
        id: exercise[0]['id'],
        content: 'update content',
        title: 'title test',
        points: 50,
        level: 'easy',
        tags: [],
        content: 'test exercise',
        languages : [ { id : language[0]['id'], sampleCode : '', isActive : true}],
        reviewerIds : [user[0]['id'],user[1]['id'],user[2]['id']],
        createdBy : exercise[0]['createdBy'],
        testcases :['#']
      
      })
      expect(res.body.success).to.equal(true)
    
  })

  it('# GET BY OWNER', async() => {
    let user = await User.find({}).limit(1);
    let res = await supertest(sails.hooks.http.app)
      .get(`/api/exercise/owner/${user[0]['id']}`)
    
    expect(res.body.success).to.equal(true)  
  
  })

  it('# DELETE EXERCISE', (done) => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if(err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/delete')
      .send({
        id: exercise[0]['id'],
        userId : exercise[0]['createdBy']
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it ('# GET APPROVE EXERCISE', done => {
      supertest(sails.hooks.http.app)
      .get('/api/exercise/approve')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
   
  })

  it('# UPDATE EXERCISE NEED APPROVE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/approve/update')
      .send({
        id: exercise[0]['id']
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET VOTE EXERCISE', async () => {
      let user = await User.find({}).limit(1);
      let exercise = await Exercise.find({}).limit(1);
      let res = await supertest(sails.hooks.http.app)
      .get(`/api/exercise/vote?userID=${ user[0]['id']}&questionID=${exercise[0]['id']}`)
      expect(res.body.success).to.equal(true)
   
  })

  it('# REACT EXERCISE', async () => {
      let user = await User.find({}).limit(1);
      let exercise = await Exercise.find({}).limit(1);
      let res = await supertest(sails.hooks.http.app)
      .post('/api/exercise/react')
      .send({
        userID: user[0]['id'],
        exerciseID: exercise[0]['id'],
        status: 'like'
      })

      expect(res.body.success).to.equal(true)
  })


  it('# SEARCH EXERCISE', done => {
    
      supertest(sails.hooks.http.app)
      .post('/api/search-exercise')
      .send({
        limit: 20,
        page: 1,
        userId: 1,
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
  })

  it('# ADD WISH LIST', async () => {

    let user = await User.find({}).limit(1);
    let question = await Exercise.find({}).limit(1);

    let token = 
    JWT.sign({
      iss: 'CodeTrainee',
      sub: user[0].id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, CONSTANTS.JWT_SECRET);


     let res = await supertest(sails.hooks.http.app)
      .post('/api/add-wishList')
      .set('Authorization', 'Bearer ' + token)
      .send({
        userId: user[0]['id'],
        questionId: question[0]['id'],
      })

      expect(res.body.success).to.equal(true)
  })

  it('# GET TAG', done => {
      supertest(sails.hooks.http.app)
      .get('/api/get-tag')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
  })

  it('# REMOVE WISH LIST', async () => {
      let exercise = await Exercise.find({}).limit(1);
      let user = await User.find({}).limit(1);

      let token = 
      JWT.sign({
        iss: 'CodeTrainee',
        sub: user[0].id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
      }, CONSTANTS.JWT_SECRET);

      let res = await supertest(sails.hooks.http.app)
      .post('/api/remove-wishList')
      .set('Authorization', 'Bearer ' + token)
      .send({
        exerciseId: exercise[0]['id'],
      })

      expect(res.body.success).to.equal(true)
  
  })

  it('# GET SUBMISSION BY USER ID', async() => {
      let user = await User.find({}).limit(1);
      let res = await supertest(sails.hooks.http.app)
      .get(`/api/get-activity-calendar/${user[0]['id']}`)

      expect(res.body.success).to.equal(true)
    
  })

  it('# GET MOST RECENT SUBMISSION', async () => {
    let user = await User.find({}).limit(1);
    let res = await supertest(sails.hooks.http.app)
      .get(`/api/get-most-recent-sub/${user[0]['id']}`)
    expect(res.body.success).to.equal(true)
   
  })

  it('# GET WISH LIST', async () => {
      let user = await User.find({}).limit(1);

      let token = 
      JWT.sign({
        iss: 'CodeTrainee',
        sub: user[0].id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
      }, CONSTANTS.JWT_SECRET);

      let res = await supertest(sails.hooks.http.app)
      .get('/api/wish-list')
      .set('Authorization', 'Bearer ' + token)

      expect(res.body.success).to.equal(true)
    
  })

  it('# GET SUBMISSION BY ID', done => {
    TrainingHistory.find({}).limit(1).exec((err, history) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get(`/api/submission/${history[0]['id']}`)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET STATISTICS OF AN EXERCISE', done => {
    Exercise.find({isDeleted : 0}).limit(1).exec((err, exe) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post(`/api/exercise/statistic`)
      .send({exerciseId :exe[0]['id'] })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

})