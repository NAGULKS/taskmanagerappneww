import express from "express"
import { getAuditLogs, getUserAuditLogs, getResourceAuditLogs } from "../controllers/auditController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, admin, getAuditLogs)
router.get("/user/:userId", protect, admin, getUserAuditLogs)
router.get("/resource/:resourceType/:resourceId", protect, admin, getResourceAuditLogs)

export default router
