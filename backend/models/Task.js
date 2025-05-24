import mongoose from "mongoose"

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add a task name"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    dueDate: {
      type: Date,
      required: [true, "Please add a due date"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)

const Task = mongoose.model("Task", taskSchema)

export default Task
