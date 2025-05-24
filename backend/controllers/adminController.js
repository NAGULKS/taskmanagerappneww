import User from "../models/User.js"
import Task from "../models/Task.js"

// @desc    Get task statistics for each user
// @route   GET /api/admin/user-task-stats
// @access  Private/Admin
export const getUserTaskStats = async (req, res) => {
  try {
    // Get all users
    const users = await User.find({})

    // Get task stats for each user
    const userTaskStats = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ user: user._id })
        const completedTasks = tasks.filter((task) => task.status === "completed").length
        const pendingTasks = tasks.filter((task) => task.status === "pending").length
        const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length

        return {
          userId: user._id,
          userName: user.name,
          isActive: user.isActive,
          totalTasks: tasks.length,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
        }
      }),
    )

    res.json(userTaskStats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get recently added users
// @route   GET /api/admin/recent-users
// @access  Private/Admin
export const getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select("-password")

    res.json(recentUsers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get tasks for a specific user
// @route   GET /api/admin/user-tasks/:userId
// @access  Private/Admin
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user by ID
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
