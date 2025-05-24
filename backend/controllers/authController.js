import jwt from "jsonwebtoken"
import User from "../models/User.js"
import AuditLog from "../models/AuditLog.js"

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
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
      isAdmin: isAdmin || false, // Allow isAdmin flag from request
    })

    if (user) {
      // Create audit log
      await AuditLog.create({
        user: user._id,
        action: "register",
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
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Create audit log
    await AuditLog.create({
      user: user._id,
      action: "login",
      resourceType: "user",
      resourceId: user._id,
      ipAddress: req.ip,
    })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email

      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      // Create audit log
      await AuditLog.create({
        user: user._id,
        action: "update",
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
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
