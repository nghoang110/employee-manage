const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { requireRole } = require("../middleware/authMiddleware");

// User điểm danh
router.post("/check-in", attendanceController.checkIn);

// Admin xem danh sách điểm danh
router.get("/", requireRole("admin"), attendanceController.getAllAttendance);

module.exports = router;
