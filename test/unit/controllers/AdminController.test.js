var supertest = require('supertest')
const { expect } = require('chai');

describe('Admin Controller Testing', () => {
  it('# GET USER BY ROLE', done => {
    UserAuthority.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/admin/get-user-by-role')
      .send({
        role: 4
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET USER BY ID', done => {
    User.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/admin/get-user-by-id')
      .send({
        userId: 7
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# EDIT AN ACCOUNT', done => {
    User.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/admin/edit-an-account')
      .send({
        role: 3,
        userId: 7
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# CREATE AN ACCOUNT', done => {
    User.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/admin/create-an-account')
      .send({
        username: 'quynhkt',
        displayName: 'quynh',
        email: 'kieuquynh1234@gmail.com',
        phone: '',
        dateOfBirth: '',
        role: 4
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# DEACTIVE AN ACCOUNT', done => {
    User.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/admin/deactive-an-account')
      .send({
        userId: 7,
        value: '',
        key: 'active'
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET USER BY ROLE WITH KEY SEARCH', done => {
    UserAuthority.find({}).limit(1).exec((err, user) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .post('/api/admin/search-fuzzy-account')
      .send({
        keySearch: "",
        role: 4
      })
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })
})