var chai = require("chai");
var supertest = require("supertest");
const { expect } = require("chai");
const User = require("../../../api/models/User");
describe("Snippet Controller", function () {
  // beforeEach(done => {
  //   var newCode = {
  //     createdBy: 1,
  //     sampleCode: 'this is sample code',
  //     isActive: true,
  //     exerciseId: 1,
  //     programLanguageId: 1
  //   }

  //   var newProgramLanguage = {
  //     name: 'Javascript',
  //     code: 63,
  //     createdBy: 1,
  //   }

  //   var newUser = {
  //     id: 1,
  //     username: 'dunker1304@gmail.com',
  //     password: '$2a$10$VgUOuxCEdjqCBdnI4gvFxefSFaIhhCTrTVsxxfW.WJTttpybibaCu',
  //     isLoginLocal: true,
  //     status: 1
  //   }
  //   var newExercise = {
  //     points: 50,
  //     level: 'easy',
  //     isApproved: true,
  //     content: '<h2>You have to count all of elements of array</h2>',
  //     title: 'Sum of array'
  //   }

  //   User.create(newUser).then(() => {
  //     Exercise.create(newExercise).then(() => {
  //       ProgramLanguage.create(newProgramLanguage).then(() => {
  //         CodeSnippet.create(newCode).then(() => {
  //           done()
  //         })
  //       })
  //     })
      
  //   })
    
  // });

  // afterEach(done => {
  //   User.destroy({}).then(() => {
  //     Exercise.destroy({}).then(() => {
  //       ProgramLanguage.destroy({}).then(() => {
  //         CodeSnippet.destroy({}).then(() => {
  //           done()
  //         })
  //       })
  //     })
  //   })
  // })


  it("# getSnippetCode", function (done) {
    CodeSnippet.find({}).limit(1).exec((err, snippet) => {
      if (err) return done(err);
      supertest(sails.hooks.http.app)
        .get("/api/snippet-code")
        .send({ userID: 1, exerciseID: 1, languageID: 1 })
        .end(function (err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("Object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("Object");
          done();
        });
    })
  })

  it('# UPDATE OR CREATE SNIPPET', done => {
    CodeSnippet.find({}).limit(1).exec((err, code) => {
      if (err) return done(err);
      supertest(sails.hooks.http.app)
      .post('/api/snippet/update')
      .send({
        supportedLanguages: [{ languageId: 1, sampleCode: "asdas", isActive: true}],
        exerciseId: 1
      })
      .end((err, res) => {
        expect(res.body.success).to.equal(true)
        done()
      })
    })
  })

});
