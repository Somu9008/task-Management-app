const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskCreatedUser,
  getTaskAssignedToUser,
  overDueTasks,
} = require("../controllers/TaskController");

router.post("/", isLoggedIn, createTask);
router.get("/created-tasks", isLoggedIn, getTaskCreatedUser);
router.get("/user-tasks", isLoggedIn, getTaskAssignedToUser);
router.post("/:id", isLoggedIn, updateTask);
router.delete("/:id", isLoggedIn, deleteTask);
router.get("/overdue", isLoggedIn, overDueTasks);

module.exports = router;
