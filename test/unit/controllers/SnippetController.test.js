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
      supertest(sails.hooks.http.app)
        .get`/api/snippet-code?exerciseID=1&languageID=1`
        .end(function (err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
  })

  it('# UPDATE OR CREATE SNIPPET', async() => {

    let language = await ProgramLanguage.find({}).limit(1);
    let exercise = await Exercise.find({}).limit(1)
    let res = await supertest(sails.hooks.http.app)
    .post('/api/snippet/update')
    .send({
      supportedLanguages: [{ languageId: language[0]['id'], sampleCode: "asdas", isActive: true}],
      exerciseId: exercise[0]['id']
    })
    expect(res.body.success).to.equal(true)
    })
});
