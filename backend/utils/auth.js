/**
 * Authentication Utilities
 * Helper functions for token generation and validation
 */

const jwt = require("jsonwebtoken")

/**
 * Generate access and refresh tokens
 */
const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "15m" })

  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key", {
    expiresIn: "7d",
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: "15m",
  }
}

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key")
}

/**
 * Generate email verification token
 */
const generateEmailToken = () => {
  return jwt.sign({ purpose: "email-verification" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" })
}

/**
 * Generate password reset token
 */
const generateResetToken = () => {
  return jwt.sign({ purpose: "password-reset" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" })
}

module.exports = {
  generateTokens,
  verifyRefreshToken,
  generateEmailToken,
  generateResetToken,
}
