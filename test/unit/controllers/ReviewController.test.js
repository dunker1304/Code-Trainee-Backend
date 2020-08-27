var supertest = require('supertest')
const { expect } = require('chai');
const { getRequestReview } = require('../../../api/controllers/ReviewController');

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
        expect(res.body.success).to.equal(false)
        done()
      })
  })

  it('# GET REQUEST REVIEW', async () => {
    
    let exercise = await Exercise.find({isApproved : "waiting", isDeleted : false}).limit(1)
    let user = await User.findOne({id : exercise[0]['createdBy']})

    let request = await RequestReview.find({exerciseId :exercise[0]['id'] })

      let res = await supertest(sails.hooks.http.app)
      .get(`api/review/request/${request[0]['id']}?userId=${user['id']}`)
  
      expect(res.body.success).to.equal(true)
   
  })

    it('# GET LAST REVIEWER', done => {
      supertest(sails.hooks.http.app)
      .get('/api/review/reviewers/1')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
   
  })

    it('# GET EXERCISE REVIEW', async () => {
      let exercise = await Exercise.find({isApproved : "waiting", isDeleted : false}).limit(1)
      let user = await User.findOne({id : exercise[0]['createdBy']})
  

      let res = await supertest(sails.hooks.http.app)
      .get(`/api/review/exercise/${exercise[0]['id']}?userId=${user['id']}`)

      expect(res.body.success).to.equal(true)
    
   })

    it('# SELF REVIEW', async () => {
      let exercise = await Exercise.find({isApproved : "waiting", isDeleted : false}).limit(1)
      let user = await User.findOne({id : exercise[0]['createdBy']})

      let request = await RequestReview.find({exerciseId :exercise[0]['id'] })
     
      let res = await supertest(sails.hooks.http.app)
      .post(`/api/self-review`)
      .send({comment : '', isAccepted : true , exerciseId :exercise[0]['id'],userId: user['id']  })

      if(request) {
        expect(res.body.success).to.equal(true)  
      }
      else {
        expect(res.body.success).to.equal(false)  
      }
     
   })


})