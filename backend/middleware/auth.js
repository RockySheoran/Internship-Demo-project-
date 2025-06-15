/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

const jwt = require("jsonwebtoken")
const User = require("../models/User")

/**
 * Verify JWT token middleware
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required",
        message: "Please provide a valid access token",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Check if user still exists
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
        message: "The user associated with this token no longer exists",
      })
    }

    // Check if user account is active
    if (!user.active) {
      return res.status(401).json({
        success: false,
        error: "Account suspended",
        message: "Your account has been suspended",
      })
    }

    // Add user to request object
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "The provided token is invalid",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired",
        message: "Your session has expired. Please log in again",
      })
    }

    console.error("Auth middleware error:", error)
    return res.status(500).json({
      success: false,
      error: "Authentication failed",
      message: "An error occurred during authentication",
    })
  }
}

/**
 * Role-based authorization middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please log in to access this resource",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
        message: "You don't have permission to access this resource",
      })
    }

    next()
  }
}

/**
 * Optional authentication middleware
 * Adds user info if token is provided, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      const user = await User.findById(decoded.userId).select("-password")

      if (user && user.active) {
        req.user = {
          userId: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        }
      }
    }

    next()
  } catch (error) {
    // Continue without authentication if token is invalid
    next()
  }
}

module.exports = {
  auth,
  authorize,
  optionalAuth,
}
