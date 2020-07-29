var url = 'http://localhost:1337'
var chai = require('chai');
var supertest = require('supertest');
const { expect } = require('chai');
describe("test controller",function(){
  it("api/test/find",function(done){
    supertest(sails.hooks.http.app)
    .get('/api/get')
    .end(function(err,res){
      expect(res.statusCode).to.equal(200); 
      expect(res.body).to.be.an('Object'); 
      done(); 
    })

  })
})