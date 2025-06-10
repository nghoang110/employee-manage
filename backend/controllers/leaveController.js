const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");

exports.createLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;
    const userId = req.user.userId;

    const employee = await Employee.findOne({ userId });
    if (!employee)
      return res.status(404).json({ error: "Không tìm thấy nhân viên" });

    const leave = new LeaveRequest({
      employee: employee._id,
      fromDate,
      toDate,
      reason,
    });
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi gửi đơn xin nghỉ" });
  }
};

exports.getMyLeave = async (req, res) => {
  try {
    const userId = req.user.userId;
    const employee = await Employee.findOne({ userId });
    if (!employee)
      return res.status(404).json({ error: "Không tìm thấy nhân viên" });

    const leaves = await LeaveRequest.find({ employee: employee._id }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách đơn xin nghỉ" });
  }
};

exports.getAllLeave = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employee", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách tất cả đơn nghỉ" });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ["pending", "approved", "rejected"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    const updated = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái đơn nghỉ" });
  }
};
