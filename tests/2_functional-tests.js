const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite(
    "POST /api/issues/{project} => create issue object/expect issue object",
    function () {
      test("Every field filled in", function (done) {
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "Title",
            issue_text: "Text",
            created_by: "User",
            assigned_to: "Assignee",
            status_text: "In Progress",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, "_id");
            assert.property(res.body, "issue_title");
            assert.property(res.body, "issue_text");
            assert.property(res.body, "created_on");
            assert.property(res.body, "updated_on");
            assert.property(res.body, "created_by");
            assert.property(res.body, "assigned_to");
            assert.property(res.body, "status_text");
            done();
          });
      });
    }
  );
});
