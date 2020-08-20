var supertest = require('supertest')
const { expect } = require('chai');

describe('Review Controller Testing', () => {

  it('# REVIEW', done => {
      supertest(sails.hooks.http.app)
      .post('/api/review')
      .send({
        comment: "",
        isAccepted: true,
        exerciseId: 1,
        userId: 7,
        requestId :1
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
  })

  // it('# GET REQUEST REVIEW', done => {
  //   Exercise.find({}).limit(1).exec((err, response) => {
  //     if (err) return done(err)
  //     supertest(sails.hooks.http.app)
  //     .get('/api/review/request/1')
  //     .end((err, res) => {
  //       if (err) return done(err)
  //       expect(res.body.success).to.equal(true)
  //       done()
  //     })
  //   })
  // })
})