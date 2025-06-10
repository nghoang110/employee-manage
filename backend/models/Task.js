const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    deadline: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Liên kết tới bảng Employee
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
