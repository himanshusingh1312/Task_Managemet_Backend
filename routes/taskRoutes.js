// Last reviewed: 2026-04-24
const express = require("express");
const router = express.Router({ mergeParams: true });
const protect = require("../middleware/authMiddleware");
const {
  addTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.use(protect);

router.post("/", addTask);
router.get("/", getTasksByProject);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;

