var chai = require("chai");
var supertest = require("supertest");
const { expect } = require("chai");
describe("Program Language Controller", function () {
  it("getAllByExercise", function (done) {
    supertest(sails.hooks.http.app)
      .get("/api/program-language/all")
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("Object");
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.be.an("Object");
        done();
      });
  });
});
