import User from "../models/User.js"
import AuditLog from "../models/AuditLog.js"

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a user (admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
    })

    if (user) {
      // Create audit log
      await AuditLog.create({
        user: req.user._id,
        action: "create",
        resourceType: "user",
        resourceId: user._id,
        details: { name, email, isAdmin },
        ipAddress: req.ip,
      })

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Deactivate a user
// @route   PUT /api/users/:id/deactivate
// @access  Private/Admin
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      user.isActive = false
      const updatedUser = await user.save()

      // Create audit log
      await AuditLog.create({
        user: req.user._id,
        action: "deactivate",
        resourceType: "user",
        resourceId: user._id,
        details: { name: user.name, email: user.email },
        ipAddress: req.ip,
      })

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isActive: updatedUser.isActive,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Activate a user
// @route   PUT /api/users/:id/activate
// @access  Private/Admin
export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      user.isActive = true
      const updatedUser = await user.save()

      // Create audit log
      await AuditLog.create({
        user: req.user._id,
        action: "update",
        resourceType: "user",
        resourceId: user._id,
        details: { name: user.name, email: user.email, isActive: true },
        ipAddress: req.ip,
      })

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isActive: updatedUser.isActive,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
