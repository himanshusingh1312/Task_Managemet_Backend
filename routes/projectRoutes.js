const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.use(protect);

router.post("/", createProject);
router.get("/", getAllProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
