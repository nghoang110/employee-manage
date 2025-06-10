const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const { auth, requireRole } = require("../middleware/authMiddleware");

router.post("/", auth, leaveController.createLeave);
router.get("/my", auth, leaveController.getMyLeave);
router.get("/", auth, requireRole("admin"), leaveController.getAllLeave);
router.put(
  "/:id",
  auth,
  requireRole("admin"),
  leaveController.updateLeaveStatus
);

module.exports = router;
