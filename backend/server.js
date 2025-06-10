const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Import routes & middleware
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const { auth } = require("./middleware/authMiddleware");
const taskRoutes = require("./routes/taskRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Routes
app.use("/auth", authRoutes);
app.use("/employees", auth, employeeRoutes); // <- sử dụng auth sau khi require
app.use("/tasks", auth, taskRoutes); // Bảo vệ bằng token
app.use("/attendance", auth, attendanceRoutes);
app.use("/comments", require("./routes/commentRoutes"));
app.use("/leave", require("./routes/leaveRoutes"));

// Mặc định GET /
app.get("/", (req, res) => {
  res.send("✅ API Employee Management đang chạy");
});

// Kết nối MongoDB và khởi động server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Đã kết nối MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));
