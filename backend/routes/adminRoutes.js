import express from "express"
import { getUserTaskStats, getRecentUsers, getUserTasks, getUserById } from "../controllers/adminController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/user-task-stats", protect, admin, getUserTaskStats)
router.get("/recent-users", protect, admin, getRecentUsers)
router.get("/user-tasks/:userId", protect, admin, getUserTasks)
router.get("/users/:userId", protect, admin, getUserById)

export default router
