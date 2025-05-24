import AuditLog from "../models/AuditLog.js"

// @desc    Get audit logs
// @route   GET /api/audit
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
  try {
    const auditLogs = await AuditLog.find({}).populate("user", "name email").sort({ createdAt: -1 })

    res.json(auditLogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get audit logs for a specific user
// @route   GET /api/audit/user/:userId
// @access  Private/Admin
export const getUserAuditLogs = async (req, res) => {
  try {
    const auditLogs = await AuditLog.find({ user: req.params.userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.json(auditLogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get audit logs for a specific resource
// @route   GET /api/audit/resource/:resourceType/:resourceId
// @access  Private/Admin
export const getResourceAuditLogs = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params

    const auditLogs = await AuditLog.find({
      resourceType,
      resourceId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.json(auditLogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
