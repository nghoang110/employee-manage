const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { requireRole } = require("../middleware/authMiddleware");

// Ai cũng xem được task
router.get("/", taskController.getTasks);
router.get("/grouped", requireRole("admin"), taskController.getGroupedTasks);

// GET: chỉ user -> xem task được gán cho mình
router.get(
  "/my-tasks",
  requireRole("user"),
  taskController.getTasksForCurrentUser
);

// Chỉ admin được tạo và xoá
router.post("/", requireRole("admin"), taskController.createTask);
router.delete("/:id", requireRole("admin"), taskController.deleteTask);

module.exports = router;
