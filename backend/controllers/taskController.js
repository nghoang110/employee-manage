const Task = require("../models/Task");
const Employee = require("../models/Employee");

// ✅ Trả về tất cả task (admin)
exports.getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo");
  res.json(tasks);
};

// ✅ Tạo task mới
exports.createTask = async (req, res) => {
  const { title, description, deadline, assignedTo } = req.body;
  const task = new Task({ title, description, deadline, assignedTo });
  const saved = await task.save();
  res.status(201).json(saved);
};

// ✅ Xoá task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá công việc" });
};

// ✅ Trả về task của người dùng đang đăng nhập
exports.getTasksForCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ error: "Không tìm thấy nhân viên" });
    }

    const allTasks = await Task.find().populate("assignedTo", "name");

    // Tìm tất cả task mà user có mặt
    const myTasks = allTasks.filter((task) => {
      return (
        task.assignedTo &&
        task.assignedTo._id.toString() === employee._id.toString()
      );
    });

    // Lấy key unique theo title + deadline
    const keys = myTasks.map(
      (task) => `${task.title}_${new Date(task.deadline).toDateString()}`
    );

    const grouped = {};

    for (const task of allTasks) {
      const key = `${task.title}_${new Date(task.deadline).toDateString()}`;

      if (!keys.includes(key)) continue;

      if (!grouped[key]) {
        grouped[key] = {
          _id: task._id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          assigned: [],
        };
      }

      if (task.assignedTo) {
        grouped[key].assigned.push(task.assignedTo);
      }
    }

    res.json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách công việc" });
  }
};

// ✅ Gộp task theo title + deadline + người nhận
exports.getGroupedTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name");

    const grouped = {};

    for (const task of tasks) {
      const key = `${task.title}_${new Date(task.deadline).toDateString()}`;

      if (!grouped[key]) {
        grouped[key] = {
          _id: task._id, // ✅ lấy _id của task đầu tiên làm đại diện
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          assigned: [],
        };
      }

      if (task.assignedTo) {
        grouped[key].assigned.push(task.assignedTo);
      }
    }

    res.json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách công việc nhóm" });
  }
};
