import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Protect routes
export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Attach user to request, excluding password
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({ message: "User not found" })
      }

      next()
    } catch (error) {
      console.error("Token verification failed:", error.message)
      return res.status(401).json({ message: "Not authorized, token invalid" })
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" })
  }
}

// Admin only access
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403).json({ message: "Access denied: Admins only" })
  }
}
