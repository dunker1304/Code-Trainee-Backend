var  supertest = require('supertest')
const { expect } = require('chai')

describe('Test Case Controller Testing', () => {

  beforeEach(done => {
    var newBlob = {
      exerciseId: 1,
      input: '1\n10',
      expectedOutput: '10',
      createdBy: 0
    }

    TestCase.create(newBlob).then(() => {
      done()
    })
  });

  afterEach(done => {
    User.destroy({}).then(() => {
      done()
    })
  })

  it('# GET TEST CASE', (done) => {
    TestCase.find({}).limit(1).exec((err, testcase) => {
      if (err) { return done(err) }
      supertest(sails.hooks.http.app)
      .get('/api/testcase?id=1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true);
        done();
      })
    })
  })

  it('# GET TEST CASE BY EXERCISE', (done) => {
    TestCase.find({}).exec((err, testcases) => {
      if (err) { return done(err) }
      supertest(sails.hooks.http.app)
      .get('/api/testcase/exercise/1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true);
        done()
      })
    })
  })
})