var url = 'http://localhost:1337'
var chai = require('chai');
var supertest = require('supertest');
const { expect } = require('chai');
const JWT = require('jsonwebtoken');
const CONSTANTS = require('../../../config/custom').custom
describe("COMMENT - CONTROLLER ",function(){
  it("# create a comment",function(done){
  User.find({}).limit(1).exec(function(err, user) {
    if (err) {return done(err)}
    let token = 
    JWT.sign({
      iss: 'CodeTrainee',
      sub: user[0].id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, CONSTANTS.JWT_SECRET);

      supertest(sails.hooks.http.app)
      .post(`/api/create-comment`)
      .set('Authorization', 'Bearer ' + token)
      .send({questionId : 1 , content : "test mochai" , title : "Test Unit Test", parentId :null })
      .end(function(err,res){
        expect(res.statusCode).to.equal(200); 
        expect(res.body).to.have.property('data').to.be.an('Object')
        expect(res.body.success).to.equal(true)
        done(); 
      })
  });

   })


   it("# vote a comment", async function(){
    let comment = await Comment.find({}).limit(1);
    let user = await User.find({}).limit(1);

    let token = 
    JWT.sign({
      iss: 'CodeTrainee',
      sub: user[0].id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, CONSTANTS.JWT_SECRET);

    let res = await supertest(sails.hooks.http.app)
    .post(`/api/create-vote-comment`)
    .set('Authorization', 'Bearer ' + token)
    .send({statusVote : 1 , commentId : comment[0]['id'] })

    expect(res.statusCode).to.equal(200); 
    expect(res.body).to.have.property('data').to.be.an('Object')
    expect(res.body.success).to.equal(true)
   });
  
   it("#get comment by question id", async function(){

    let exercise = await Exercise.find({}).limit(1);
    let page = 1;
    let sortBy = 1;

    let res = await supertest(sails.hooks.http.app)
    .post(`/api/get-comment-question-id`)
    //.set('Authorization', 'Bearer ' + token)
    .send({questionId : exercise[0]['id'] , page : page , sortBy:sortBy })

    expect(res.statusCode).to.equal(200); 
    expect(res.body).to.have.property('data').to.be.an('Object')
    expect(res.body.data).to.have.property('comments').to.be.an('Array')
    expect(res.body.data).to.have.property('total').to.be.an('number')
    expect(res.body.success).to.equal(true)
   });

   
   it("#get comment by commentId", async function(){

    let comment = await Comment.find({}).limit(1);
    let user = await User.find({}).limit(1);

    let token = 
    JWT.sign({
      iss: 'CodeTrainee',
      sub: user[0].id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, CONSTANTS.JWT_SECRET);
  
    let res = await supertest(sails.hooks.http.app)
    .post(`/api/get-comment-comment-id`)
    .set('Authorization', 'Bearer ' + token)
    .send({commentId : comment[0]['id']})

    expect(res.statusCode).to.equal(200); 
    expect(res.body).to.have.property('data').to.be.an('Object')
    expect(res.body.success).to.equal(true)
   });

  
   
   it("#delete A comment", async function(){

    let comment = await Comment.find({}).limit(1);
    let user = await User.find({}).limit(1);

    let token = 
    JWT.sign({
      iss: 'CodeTrainee',
      sub: user[0].id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, CONSTANTS.JWT_SECRET);
  
    let res = await supertest(sails.hooks.http.app)
    .post(`/api/delete-a-comment`)
    .set('Authorization', 'Bearer ' + token)
    .send({commentId : comment[0]['id']})

    expect(res.statusCode).to.equal(200); 
    expect(res.body).to.have.property('data').to.be.an('Object')
    expect(res.body.success).to.equal(true)
   });

  
})