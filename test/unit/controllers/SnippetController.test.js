var chai = require("chai");
var supertest = require("supertest");
const { expect } = require("chai");
describe("Snippet Controller", function () {
  it("updateOrCreateSample", function (done) {
    supertest(sails.hooks.http.app)
      .post("/api/snippet/sample/update")
      .send({ exerciseId: 1, languageId: 1, sampleCode: "sample" })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("Object");
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.be.an("Object");
        expect(res.body.data.id).to.be.an("Number");
        done();
      });
  });
  it("updateOrCreateSupportedLanguage", function (done) {
    supertest(sails.hooks.http.app)
      .post("/api/snippet/supported-language/update")
      .send({
        activeLangIds: [],
        notActiveLangIds: [],
        exerciseId: 1,
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("Object");
        expect(res.body.success).to.equal(true);
        done();
      });
  });
  it("getSnippetCode", function (done) {
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
  });
});
