"use strict";

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      res.json({
        project: project,
        issue_title: req.query.issue_title,
        issue_text: req.query.issue_text,
        created_by: req.query.created_by,
        assigned_to: req.query.assigned_to,
        status_text: req.query.status_text,
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
