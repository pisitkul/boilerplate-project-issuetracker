const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let IssueId = null; // Variable to store the ID of the created issue
suite("Functional Tests", function () {
  suite("POST /api/issues/{project} => create issue object", function () {
    test("Every field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "Text",
          created_by: "User",
          assigned_to: "Assignee",
          status_text: "Status",
        })
        .end(function (err, res) {
          IssueId = res.body; // Store the ID of the created issue
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "Text");
          assert.equal(res.body.created_by, "User");
          assert.equal(res.body.assigned_to, "Assignee");
          assert.equal(res.body.status_text, "Status");
          done();
        });
    });

    test("Required fields filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "Text",
          created_by: "User",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "Text");
          assert.equal(res.body.created_by, "User");
          done();
        });
    });

    test("Missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_text: "Text",
          created_by: "User",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET /api/issues/{project} => view issues on an issue", function () {
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ open: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "Issues is an array");
          done();
        });
    });

    test("View issues with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ open: true, assigned_to: "Assignee" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "Issues is an array");
          done();
        });
    });

    test("View issues with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ open: true, assigned_to: "Assignee", status_text: "Status" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "Issues is an array");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => update issue", function () {
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: IssueId._id,
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          //   console.log("PUT Test Response:", res.body);
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });

    test("Update multiple fields on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: IssueId._id,
          issue_title: "Updated Title",
          issue_text: "Updated Text",
        })
        .end(function (err, res) {
          //   console.log("PUT Test Response:", res.body);
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });

    test("Missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    test("No update field sent", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "60d5f484f1b2c8a0b4e4e4e4",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });

    test("Invalid _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "invalid_id",
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });

  suite("DELETE /api/issues/{project} => delete issue", function () {
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: IssueId._id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
    });

    test("Missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    test("Invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: "invalid_id",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          done();
        });
    });
  });
});
