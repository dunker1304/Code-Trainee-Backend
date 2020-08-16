var url = 'http://localhost:1337'
var chai = require('chai');
var supertest = require('supertest');
const { expect } = require('chai');
const CommentComponent = require('../../../api/components/CommentComponent');
describe("test controller",function(){
  it('# CREATE COMMENT', done => {
    Comment.find({}).limit(1).exec((err, comment) => {
      if (err) return done(err);
      supertest(sails.hooks.http.app)
      .post('/api/create-comment')
      .send({
        questionId: 1,
        content: 'comment 1',
        parentId: -1,
        title: 'comment'
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# VOTE COMMENT', done => {
    CommentVote.find({}).limit(1).exec((err, comment) => {
      if (err) return done(err);
      supertest(sails.hooks.http.app)
      .post('/api/create-vote-comment')
      .send({
        statusVote: 1,
        commentId: 1
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET COMMENT BY EXERCISE ID', done => {
    Comment.find({}).limit(1).exec((err, comment) => {
      if (err) return done(err);
      supertest(sails.hooks.http.app)
      .post('/api/get-comment-question-id')
      .send({
        questionId: 1,
        sortBy: 1
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

  it('# GET COMMENT BY COMMENT ID', done => {
    Comment.find({}).limit(1).exec((err, comment) => {
      if (err) return done(err);
      supertest(sails.hooks.http.app)
      .post('/api/get-comment-comment-id')
      .send({
        commentId: 1,
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })
  
  it('# DELETE COMMENT', done => {
    Comment.find({}).limit(1).exec((err, comment) => {
      if (err) return done(err);
      supertest(sails.hooks.http.app)
      .post('/api/delete-a-comment')
      .send({
        commentId: 1,
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

})