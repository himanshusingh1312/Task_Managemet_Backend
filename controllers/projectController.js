const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;

    if (!projectName) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      projectName,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { projectName, description } = req.body;

    if (projectName) project.projectName = projectName;
    if (description !== undefined) project.description = description;

    await project.save();

    res.status(200).json({ message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createProject, getAllProjects, updateProject, deleteProject };
