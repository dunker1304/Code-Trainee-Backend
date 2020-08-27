var supertest = require('supertest');
const { expect } = require('chai');
const JWT = require('jsonwebtoken');
const CONSTANTS = require('../../../config/custom').custom
describe("User Controller Testing",function(){

  // beforeEach(function(done){
  //   var newBlob = {
  //     email :'xyz@gmail.com',
  //     secret :'345zdfertrgytyj3457',
  //     displayName :'anhoang',
  //     username :'anhoang',
  //     password:'123456',
  //     isLoginLocal:1,
  //     status:1
      
  //   }

  //   User.create(newBlob).then(function(){
  //     done()
  //   })
    
  // });
  // afterEach(function(done){
  //    User.destroy({}).then(function(){
  //      done()
  //    })
  // });


  it("# GET USER BY ID",  function(done){
    User.find({}).limit(1).exec(function(err, user) {
      if (err) {return done(err)}
        supertest(sails.hooks.http.app)
        .get(`/api/profile/${user[0]['id']}`)
        .end(function(err,res){
          expect(res.statusCode).to.equal(200); 
          expect(res.body).to.be.an('Object');
          expect(res.body.success).to.equal(true)
          done(); 
        })
    });
  })

  it("# API VERIFY A COUNT",  function(done){
  
    User.find({}).limit(1).exec(function(err, user) {
      if (err) {return done(err)}
        supertest(sails.hooks.http.app)
        .get(`/accounts/confirm-email/${user[0]['secret']}`)
        .end(function(err,res){
          expect(res.statusCode).to.equal(200); 
          expect(res.body.message).to.be.equal('confirm email success');
          expect(res.body.success).to.equal(true)
          done(); 
        })
    });
     
  })

  it('# API CURRENT USER',function(done){
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
        .get(`/api/current_user`)
        .set('Authorization', 'Bearer ' + token)
        .end(function(err,res){
          expect(res.statusCode).to.equal(200); 
          expect(res.body).to.have.property('user').to.be.an('Object')
          expect(res.body.success).to.equal(true)
          done(); 
        })
    });
  })

  it('# API SIGN IN', function(done){
    User.find({}).limit(1).exec(function(err, user) {
      if (err) {return done(err)}
        supertest(sails.hooks.http.app)
        .post(`/signin`)
        .send({email:'xyz@gmail.com', password :'123456'})
        .end(function(err,res){
          expect(res.statusCode).to.equal(200); 
          expect(res.body).to.have.property('user').to.be.an('Object')
          expect(res.body.success).to.equal(true)
          expect(res.body.message).to.equal('Login successfully')
          done(); 
        })
    });

    
  })

  // it('# API SIGN UP', function(done){
  //   supertest(sails.hooks.http.app)
  //   .post(`/signup`)
  //   .send({email:'xyzt@gmail.com', password :'123456', username :'toikhongthe', role :1})
  //   .end(function(err,res){
  //     expect(res.statusCode).to.equal(200); 
  //     expect(res.body.success).to.equal(true)
  //     expect(res.body.message).to.equal('Please check your mailbox for new registration. If you do not receive any email, please check your junk or spam folder.')
  //     done(); 
  //   })
  // })

  it('# API GET EXERCISE OF A USER',function(done){
    supertest(sails.hooks.http.app)
    .get(`/api/user/exercise`)
    .end(function(err,res){
      expect(res.statusCode).to.equal(200); 
      expect(res.body.success).to.equal(true)
      expect(res.body.data).to.an('Object')
      expect(res.body.data).to.have.property('easy').to.be.an('number')
      expect(res.body.data).to.have.property('medium').to.be.an('number')
      expect(res.body.data).to.have.property('hard').to.be.an('number')
      expect(res.body.data).to.have.property('total').to.be.an('number')
      done(); 
    })
  })

  it('# API GET ROLE',function(done){
    supertest(sails.hooks.http.app)
    .post(`/api/user/role`)
    .end(function(err,res){
      expect(res.statusCode).to.equal(200); 
      expect(res.body.success).to.equal(true)
      expect(res.body.data).to.an('array')
      done(); 
    })
  })

  it('# API SIGN OUT',function(done){
    supertest(sails.hooks.http.app)
    .get(`/signout`)
    .end(function(err,res){
      expect(res.statusCode).to.equal(200); 
      expect(res.body.success).to.equal(true)
      done(); 
    })
  })

  it('# GOOGLE AUTH', done => {
    supertest(sails.hooks.http.app)
    .get('/api/google/4')
    .end((err, res) => {
      if (err) return done(err)
      expect(res.body.success).to.equal(true)
      done()
    })
  })

  it('# GOOGLE CALL BACK', done => {
    supertest(sails.hooks.http.app)
    .get('/oauth/google/callback')
    .end((err, res) => {
      done()
    })
  })

  it('# GET ALL TEACHERS ACTIVE', done => {
    Role.find({}).limit(1).exec((err, role) => {
      if (err) return done(err)
      supertest(sails.hooks.http.app)
      .get('/api/user/teacher/all?userId=1')
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })


})


