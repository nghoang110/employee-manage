const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { auth, requireRole } = require("../middleware/authMiddleware");

// Xem danh sách nhân viên
router.get("/", employeeController.getAllEmployees);

// Chỉ admin được phép thêm, sửa, xoá
router.post("/", requireRole("admin"), employeeController.createEmployee);
router.put("/:id", requireRole("admin"), employeeController.updateEmployee);
router.delete("/:id", requireRole("admin"), employeeController.deleteEmployee);

// ✅ Route mới: Tạo User + Nhân viên
router.post(
  "/create-with-user",
  auth,
  requireRole("admin"),
  employeeController.createEmployeeWithUser
);

module.exports = router;
