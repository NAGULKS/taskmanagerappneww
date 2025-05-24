import express from "express"
import { getUsers, createUser, deactivateUser, activateUser } from "../controllers/userController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, admin, getUsers).post(protect, admin, createUser)

router.put("/:id/deactivate", protect, admin, deactivateUser)
router.put("/:id/activate", protect, admin, activateUser)

export default router
