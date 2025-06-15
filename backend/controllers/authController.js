/**
 * Authentication Controller
 * Handles all authentication-related operations
 */

const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const User = require("../models/User")
const { sendEmail } = require("../utils/email")
const { generateTokens, verifyRefreshToken } = require("../utils/auth")

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      })
    }

    const { name, email, password, role = "user" } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
        message: "An account with this email address already exists",
      })
    }

    // Create email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role,
      emailVerificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })

    // Set host-specific fields if registering as host
    if (role === "host") {
      user.hostInfo.joinedAsHost = new Date()
    }

    await user.save()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Update login stats
    user.loginCount += 1
    user.lastLogin = new Date()
    await user.save()

    // Send verification email (in production)
    if (process.env.NODE_ENV === "production") {
      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your StayFinder account",
          template: "email-verification",
          data: {
            name: user.name,
            verificationUrl: `${process.env.FRONTEND_URL}/auth/verify-email?token=${emailVerificationToken}`,
          },
        })
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError)
        // Don't fail registration if email fails
      }
    }

    // Send response (exclude sensitive data)
    const userResponse = user.getPublicProfile()

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
        expiresIn: "7d",
      },
    })

    console.log(`📧 User registered: ${email}`)
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      error: "Registration failed",
      message: "An error occurred during registration. Please try again.",
    })
  }
}

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      })
    }

    const { email, password } = req.body

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      })
    }

    // Check if account is active
    if (!user.active) {
      return res.status(400).json({
        success: false,
        error: "Account suspended",
        message: "Your account has been suspended. Please contact support.",
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Update login stats
    user.loginCount += 1
    user.lastLogin = new Date()
    await user.save()

    // Send response (exclude sensitive data)
    const userResponse = user.getPublicProfile()

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
        expiresIn: "7d",
      },
    })

    console.log(`🔐 User logged in: ${email}`)
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: "Login failed",
      message: "An error occurred during login. Please try again.",
    })
  }
}

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("stats").select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        message: "User account no longer exists",
      })
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data",
      message: "An error occurred while fetching your profile",
    })
  }
}

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Update allowed fields
    const allowedUpdates = ["name", "phone", "bio", "dateOfBirth", "address", "preferences", "socialLinks", "hostInfo"]

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "hostInfo" && user.role !== "host" && user.role !== "admin") {
          return // Skip host info updates for non-hosts
        }
        user[field] = req.body[field]
      }
    })

    await user.save()

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: user.getPublicProfile(),
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
      message: "An error occurred while updating your profile",
    })
  }
}

/**
 * Change user password
 */
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      })
    }

    const { currentPassword, newPassword } = req.body

    // Find user with password
    const user = await User.findById(req.user.userId).select("+password")
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid current password",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to change password",
      message: "An error occurred while changing your password",
    })
  }
}

/**
 * Refresh access token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token required",
      })
    }

    const decoded = verifyRefreshToken(refreshToken)
    const user = await User.findById(decoded.userId)

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      })
    }

    // Generate new tokens
    const tokens = generateTokens(user)

    res.json({
      success: true,
      data: tokens,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({
      success: false,
      error: "Invalid refresh token",
    })
  }
}

/**
 * Logout user
 */
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // In production, you might want to implement token blacklisting
    res.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      success: false,
      error: "Logout failed",
    })
  }
}

/**
 * Verify email address
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification token",
      })
    }

    user.verified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    res.status(500).json({
      success: false,
      error: "Email verification failed",
    })
  }
}

/**
 * Request password reset
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.passwordResetToken = resetToken
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    // Send reset email (in production)
    if (process.env.NODE_ENV === "production") {
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your StayFinder password",
          template: "password-reset",
          data: {
            name: user.name,
            resetUrl: `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`,
          },
        })
      } catch (emailError) {
        console.error("Failed to send reset email:", emailError)
      }
    }

    res.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to process password reset request",
    })
  }
}

/**
 * Reset password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      })
    }

    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to reset password",
    })
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
}
