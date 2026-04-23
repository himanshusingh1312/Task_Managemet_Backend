// Last reviewed: 2026-04-24
const Task = require("../models/Task");
const Project = require("../models/Project");

const addTask = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, createdBy: req.user.id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId: project._id,
    });

    res.status(201).json({ message: "Task added", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, createdBy: req.user.id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const filter = { projectId: project._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findOne({ _id: task.projectId, createdBy: req.user.id });

    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findOne({ _id: task.projectId, createdBy: req.user.id });

    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { addTask, getTasksByProject, updateTask, deleteTask };

