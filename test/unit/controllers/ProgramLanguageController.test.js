var chai = require("chai");
var supertest = require("supertest");
const { expect } = require("chai");
describe("Program Language Controller", function () {
  it('# GET ALL BY EXERCISE ID', done => {
    ProgramLanguage.find({}).limit(1).exec((err, language) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/language/exercise/1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET ALL BY EXERCISE ID', done => {
    ProgramLanguage.find({}).limit(1).exec((err, language) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/language/all')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

});
