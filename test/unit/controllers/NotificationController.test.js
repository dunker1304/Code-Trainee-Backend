var supertest = require('supertest')
const { expect } = require('chai');

describe('Notification Controller Testing', () => {
  it('# GET MOST NOTIFICATION', done => {
    User.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get(`/api/get-most-notification/${user[0]['id']}`)
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# MARK AS READ', async () => {
      let user = await User.find({}).limit(1);
      let noti = await Notification.find({isRead : false ,receiver : user[0]['id'] }).limit(1);
      let res  = await supertest(sails.hooks.http.app)
      .post('/api/mark-as-read')
      .send({
        notificationId: noti ? noti[0]['id'] : 0,
        isRead: true,
        userId: user[0]['id']
      })

      expect(res.body.success).to.equal(true)
    
  })

  it('# REMOVE NOTIFICATION', async () => {
      let user = await User.find({}).limit(1);
      let noti = await Notification.find({isDeleted : false ,receiver : user[0]['id'] }).limit(1);
      let res = await supertest(sails.hooks.http.app)
      .post('/api/remove-notification')
      .send({
        notificationId: noti ? noti[0]['id']:0
      })

      expect(res.body.success).to.equal(true)
   
  })

  it('# GET ALL NOTIFICATION', done => {
    User.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get(`/api/get-all-notification/${user[0]['id']}`)
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# PUSH NOTIFICATION', done => {
    User.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/notification/push')
      .send({
        reviewerIds: [user[0]['id']]
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })
})