const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    const userId = req.user.userId;

    const comment = new Comment({ taskId, userId, content });
    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi gửi bình luận" });
  }
};

exports.getCommentsByTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const comments = await Comment.find({ taskId })
      .populate("userId", "username role")
      .sort({ createdAt: 1 }); // tăng dần thời gian

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy bình luận" });
  }
};
