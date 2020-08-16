var supertest = require('supertest')
const { expect } = require('chai');

describe('Notification Controller Testing', () => {
  it('# GET MOST NOTIFICATION', done => {
    Notification.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/get-most-notification/7')
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# MARK AS READ', done => {
    Notification.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/mark-as-read')
      .send({
        notificationId: 25,
        isRead: true,
        userId: 7
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# REMOVE NOTIFICATION', done => {
    Notification.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/remove-notification')
      .send({
        notificationId: 25
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET ALL NOTIFICATION', done => {
    Notification.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/get-all-notification/7')
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# PUSH NOTIFICATION', done => {
    Notification.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/notification/push')
      .send({
        reviewerIds: ""
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })
})