const Attendance = require("../models/Attendance");

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const attendance = new Attendance({
      userId,
      date: today,
      time: now.toLocaleTimeString("vi-VN", { hour12: false }),
    });

    await attendance.save();
    res.status(201).json({ message: "Điểm danh thành công" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Bạn đã điểm danh hôm nay rồi" });
    } else {
      res.status(500).json({ error: "Lỗi khi điểm danh" });
    }
  }
};

exports.getAllAttendance = async (req, res) => {
  const data = await Attendance.find()
    .populate("userId", "username")
    .sort({ date: -1 });
  res.json(data);
};
