import express from "express"
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksDueToday,
  getTasksCompletedLastWeek,
  getUpcomingTasks,
  getPopularCategories,
  getAllTasks, // New admin route
} from "../controllers/taskController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, getTasks).post(protect, createTask)

router.get("/due-today", protect, getTasksDueToday)
router.get("/completed-last-week", protect, getTasksCompletedLastWeek)
router.get("/upcoming", protect, getUpcomingTasks)
router.get("/popular-categories", protect, getPopularCategories)

// Admin route to get all tasks
router.get("/admin/all", protect, admin, getAllTasks)

router.route("/:id").get(protect, getTaskById).put(protect, updateTask).delete(protect, deleteTask)

export default router
