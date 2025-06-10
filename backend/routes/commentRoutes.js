const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { auth } = require("../middleware/authMiddleware");

router.post("/", auth, commentController.createComment);
router.get("/:taskId", auth, commentController.getCommentsByTask);

module.exports = router;
