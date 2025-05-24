import Task from "../models/Task.js"
import AuditLog from "../models/AuditLog.js"

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { name, description, category, dueDate, status } = req.body

    const task = await Task.create({
      user: req.user._id,
      name,
      description,
      category,
      dueDate,
      status,
    })

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: "create",
      resourceType: "task",
      resourceId: task._id,
      details: { name, description, category, dueDate, status },
      ipAddress: req.ip,
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const { name, description, category, dueDate, status } = req.body

    task.name = name || task.name
    task.description = description || task.description
    task.category = category || task.category
    task.dueDate = dueDate || task.dueDate
    task.status = status || task.status

    const updatedTask = await task.save()

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: "update",
      resourceType: "task",
      resourceId: task._id,
      details: { name, description, category, dueDate, status },
      ipAddress: req.ip,
    })

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await task.deleteOne()

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: "delete",
      resourceType: "task",
      resourceId: task._id,
      details: { name: task.name },
      ipAddress: req.ip,
    })

    res.json({ message: "Task removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get tasks due today
// @route   GET /api/tasks/due-today
// @access  Private
export const getTasksDueToday = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get tasks completed in last 7 days
// @route   GET /api/tasks/completed-last-week
// @access  Private
export const getTasksCompletedLastWeek = async (req, res) => {
  try {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const tasks = await Task.find({
      user: req.user._id,
      status: "completed",
      updatedAt: {
        $gte: sevenDaysAgo,
        $lte: today,
      },
    })

    // Group by day
    const tasksByDay = {}

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      tasksByDay[dateString] = 0
    }

    tasks.forEach((task) => {
      const dateString = task.updatedAt.toISOString().split("T")[0]
      if (tasksByDay[dateString] !== undefined) {
        tasksByDay[dateString]++
      }
    })

    // Convert to array for chart
    const chartData = Object.keys(tasksByDay)
      .map((date) => ({
        date,
        count: tasksByDay[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    res.json(chartData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get upcoming tasks
// @route   GET /api/tasks/upcoming
// @access  Private
export const getUpcomingTasks = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: today },
      status: { $ne: "completed" },
    }).sort({ dueDate: 1 })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get popular task categories
// @route   GET /api/tasks/popular-categories
// @access  Private
export const getPopularCategories = async (req, res) => {
  try {
    const categories = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all tasks (admin only)
// @route   GET /api/tasks/admin/all
// @access  Private/Admin
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("user", "name email")
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
