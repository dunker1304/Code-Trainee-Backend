var supertest = require('supertest')
const { expect } = require('chai');

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

  it('# GET EXERCISE BY ID', (done) => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/exercise?id=1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        expect(res.body.total).to.equal(1)
        done()
      })
    })
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
        question_id: 1
      })
      .end((err, res) => {
        //expect(res.body[0].success).to.equal(true)
        done()
      })
    })
  })

  it('# GET ALL SUBMISSION BY USER', done => {
    TrainingHistory.find({}).limit(1).exec((err, submissions) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/submissions/all?userID=1&exerciseID=1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })

    })
  })

  it('# SUBMIT SOLUTION', done => {
    TrainingHistory.find({}).limit(1).exec((err, history) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
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
        language: 2,
        userID: 3
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET RANDOM EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if(err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/exercise/random')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET INFO EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/exercise/basic-info/1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# CREATE EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/create')
      .send({
        content: 'test exercise',
        title: 'title test',
        points: 50,
        level: 'easy',
        tags: []
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# UPDATE EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/update')
      .send({
        id: 1,
        content: 'update content',
        title: 'title test',
        points: 50,
        level: 'easy',
        tags: []
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET BY OWNER', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/exercise/owner/3')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# DELETE EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if(err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/delete')
      .send({
        id: 10
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it ('# GET APPROVE EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/exercise/approve')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# UPDATE EXERCISE NEED APPROVE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/approve/update')
      .send({
        id: 10
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET VOTE EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/vote')
      .send({
        userID: 7,
        questionID: 1
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# REACT EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/react')
      .send({
        userID: 7,
        exerciseID: 1,
        status: 'like'
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# REACT EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/react')
      .send({
        userID: 7,
        exerciseID: 1,
        status: 'dislike'
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET VOTE EXERCISE', done => {
    ExerciseVote.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/exercise/vote?userID=9&questionID=1')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# REACT EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/exercise/react')
      .send({
        userID: 9,
        exerciseID: 1,
        status: 1
      })
      end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET EXERCISE TO REVIEW', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/exercise/review/3')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# SEARCH EXERCISE', done => {
    Exercise.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/search-exercise')
      .send({
        limit: 20,
        page: 1,
        userId: 1,
        level: 'easy',
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# ADD WISH LIST', done => {
    WishList.find({}).limit(1).exec((err, exercise) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/add-wishList')
      .send({
        userId: 7,
        questionId: 21,
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET TAG', done => {
    Tag.find({}).limit(1).exec((err, tag) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/get-tag')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# REMOVE WISH LIST', done => {
    WishList.find({}).limit(1).exec((err, wishlist) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/remove-wishList')
      .send({
        exerciseId: 1,
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET SUBMISSION BY USER ID', done => {
    TrainingHistory.find({}).limit(1).exec((err, history) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/get-activity-calendar/7')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET MOST RECENT SUBMISSION', done => {
    TrainingHistory.find({}).limit(1).exec((err, history) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/get-most-recent-sub/7')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET WISH LIST', done => {
    WishList.find({}).limit(1).exec((err, wishlist) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/wish-list')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET SUBMISSION BY ID', done => {
    Transaction.find({}).limit(1).exec((err, history) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/submission/7')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

})