var chai = require("chai");
var supertest = require("supertest");
const { expect } = require("chai");
describe("Snippet Controller", function () {
  it("getTagsByExerciseId", function (done) {
    supertest(sails.hooks.http.app)
      .get("/api/tags/exercise/1")
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("Object");
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.be.an("Array");
        done();
      });
  });
  it("getAllTags", function (done) {
    supertest(sails.hooks.http.app)
      .get("/api/tags/all")
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("Object");
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.be.an("Array");
        done();
      });
  });
});
