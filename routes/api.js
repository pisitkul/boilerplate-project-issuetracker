"use strict";

const mongoose = require("mongoose");
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;

      const projectData = await ProjectModel.findOne({ name: project });

      if (!projectData) {
        // console.log(`Project id ${project} not found`);
        return res.json({ error: "Project not found" });
      }

      const issues = await IssueModel.find({
        projectId: projectData._id,
        ...req.query,
      });

      // console.log("Project Issues:", issues);
      res.json(issues || []);
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by } = req.body;
      // console.log("post method called for project:", project);

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      try {
        let Project = await ProjectModel.findOne({ name: project });

        if (!Project) {
          Project = new ProjectModel({ name: project });
          Project = await Project.save();
        }

        const issue = new IssueModel({
          projectId: Project._id,
          issue_title,
          issue_text,
          created_by,
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
        });

        issue.created_on = new Date();
        issue.updated_on = new Date();

        issue.save();
        res.json(issue);
      } catch (error) {
        console.error("Error saving issue:", error);
        return res.json({ error: "Internal server error" });
      }
    })

    .put(async function (req, res) {
      const project = req.params.project;
      const { _id, ...updateData } = req.body;

      // console.log("PUT called for project:", project);
      // console.log("Update data:", updateData);

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      if (Object.keys(updateData).length === 0) {
        return res.json({ error: "no update field(s) sent", _id });
      }

      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.json({ error: "could not update", _id });
      }

      try {
        const projectData = await ProjectModel.findOne({ name: project });
        if (!projectData) {
          return res.json({ error: "Project not found" });
        }

        const issue = await IssueModel.findOne({
          _id,
          projectId: projectData._id,
        });

        if (!issue) {
          return res.json({ error: "could not update", _id });
        }

        updateData.updated_on = new Date();

        const updated = await IssueModel.findByIdAndUpdate(_id, updateData, {
          new: true,
        });

        if (!updated) {
          return res.json({ error: "could not update", _id });
        }

        return res.json({ result: "successfully updated", _id });
      } catch (err) {
        console.error("PUT error:", err);
        return res.json({ error: "could not update", _id });
      }
    })

    .delete(async function (req, res) {
      const project = req.params.project;
      const { _id } = req.body;

      // console.log("DELETE called for project:", project);
      // console.log("ID to delete:", _id);

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.json({ error: "could not delete", _id });
      }

      try {
        const deleted = await IssueModel.findByIdAndDelete(_id);
        if (!deleted) {
          return res.json({ error: "could not delete", _id });
        }

        return res.json({ result: "successfully deleted", _id });
      } catch (err) {
        console.error("Delete error:", err);
        return res.json({ error: "could not delete", _id });
      }
    });
};
