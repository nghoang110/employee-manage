const Employee = require("../models/Employee");
const User = require("../models/User");

// ✅ Lấy danh sách nhân viên (theo quyền)
exports.getAllEmployees = async (req, res) => {
  try {
    let query = {};

    // Nếu là admin phòng ban → chỉ xem nhân viên cùng phòng
    if (req.user.role === "departmentadmin") {
      query.department = req.user.department;
    }

    const employees = await Employee.find(query).populate("userId", "username");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Không thể lấy danh sách nhân viên" });
  }
};

// ✅ Tạo nhân viên (cũ - không có tài khoản)
exports.createEmployee = async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    const saved = await newEmp.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi tạo nhân viên" });
  }
};

// ✅ Cập nhật nhân viên
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi cập nhật nhân viên" });
  }
};

// ✅ Xoá nhân viên
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoá nhân viên thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi xoá nhân viên" });
  }
};

// ✅ Tạo nhân viên kèm tài khoản
exports.createEmployeeWithUser = async (req, res) => {
  try {
    const { username, password, name, position, department, email } = req.body;

    // 1. Kiểm tra username
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ error: "Tài khoản đã tồn tại" });

    // 2. Nếu là admin phòng ban → override department
    let dept = department;
    let role = "user";
    if (req.user.role === "departmentadmin") {
      dept = req.user.department;
    }

    // 3. Tạo User
    const user = new User({
      username,
      password,
      role,
      department:
        req.user.role === "departmentadmin" ? req.user.department : department,
    });
    await user.save();

    // 4. Tạo Employee gắn với user
    const employee = new Employee({
      name,
      position,
      department: dept,
      email,
      userId: user._id,
    });
    const saved = await employee.save();

    res
      .status(201)
      .json({ message: "Tạo nhân viên thành công", employee: saved });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi tạo nhân viên và tài khoản" });
  }
};
