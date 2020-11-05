const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Project = require("../models/project");
const Task = require("../models/task");

const router = express.Router();

router.use(authMiddleware);

// List
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate(["user", "tasks"]);
    return res.send({ projects });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Erro ao buscar a lista de projetos" });
  }
});

// List by id
router.get("/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate([
      "user",
      "tasks"
    ]);
    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao buscar o projeto" });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = await Project.create({
      title,
      description,
      user: req.userId
    });

    await Promise.all(
      tasks.map(async task => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      })
    );

    await project.save();

    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao criar o projeto" });
  }
});

// Update
router.put("/:projectId", async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description
      },
      { new: true }
    );
    if (project && project.tasks) {
      project.tasks = [];
      await Task.deleteMany({ project: project._id });
    }

    if (tasks && tasks.length > 0) {
      await Promise.all(
        tasks.map(async task => {
          const projectTask = new Task({ ...task, project: project._id });

          await projectTask.save();

          project.tasks.push(projectTask);
        })
      );
    }

    await project.save();

    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao atualizar o projeto" });
  }
});

// Delete
router.delete("/:projectId", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Erro ao deletar o projeto" });
  }
});

module.exports = app => {
  app.use("/projects", router);
};
