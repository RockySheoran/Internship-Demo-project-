/**
 * Authentication Routes
 * Handles user registration, login, and authentication-related operations
 */

const express = require("express")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User")
const Listing = require("../models/Listing")
const Booking = require("../models/Booking")
const auth = require("../middleware/auth")
const { body, validationResult } = require("express-validator")

const router = express.Router()

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  [
    // Validation middleware
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    body("role").optional().isIn(["user", "host"]).withMessage("Role must be either 'user' or 'host'"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { name, email, password, role = "user" } = req.body

      // Check if user already exists
      const existingUser = await User.findByEmail(email)
      if (existingUser) {
        return res.status(400).json({
          error: "User already exists",
          message: "An account with this email address already exists",
        })
      }

      // Create new user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        role,
        emailVerificationToken: crypto.randomBytes(32).toString("hex"),
        emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })

      // Set host-specific fields if registering as host
      if (role === "host") {
        user.hostInfo.joinedAsHost = new Date()
      }

      await user.save()

      // Generate JWT token
      const token = jwt.sign(user.getTokenPayload(), process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

      // Update login stats
      user.loginCount += 1
      user.lastLogin = new Date()
      await user.save()

      // Send response (exclude sensitive data)
      const userResponse = user.getPublicProfile()

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: userResponse,
        expiresIn: "7d",
      })

      // TODO: Send verification email in production
      console.log(`📧 Verification email would be sent to: ${email}`)
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        error: "Registration failed",
        message: "An error occurred during registration. Please try again.",
      })
    }
  },
)

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { email, password } = req.body

      // Find user and include password for comparison
      const user = await User.findByEmail(email).select("+password")
      if (!user) {
        return res.status(400).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        })
      }

      // Check if account is active
      if (!user.active) {
        return res.status(400).json({
          error: "Account suspended",
          message: "Your account has been suspended. Please contact support.",
        })
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(400).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        })
      }

      // Generate JWT token
      const token = jwt.sign(user.getTokenPayload(), process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

      // Update login stats
      user.loginCount += 1
      user.lastLogin = new Date()
      await user.save()

      // Send response (exclude sensitive data)
      const userResponse = user.getPublicProfile()

      res.json({
        message: "Login successful",
        token,
        user: userResponse,
        expiresIn: "7d",
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        error: "Login failed",
        message: "An error occurred during login. Please try again.",
      })
    }
  },
)

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("stats")

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User account no longer exists",
      })
    }

    res.json(user.getPublicProfile())
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      error: "Failed to fetch user data",
      message: "An error occurred while fetching your profile",
    })
  }
})

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/profile",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("phone")
      .optional()
      .matches(/^\+?[\d\s\-$$$$]+$/)
      .withMessage("Please provide a valid phone number"),
    body("bio").optional().isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const user = await User.findById(req.user.userId)
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        })
      }

      // Update allowed fields
      const allowedUpdates = ["name", "phone", "bio", "dateOfBirth", "address", "preferences", "socialLinks"]

      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field]
        }
      })

      await user.save()

      res.json({
        message: "Profile updated successfully",
        user: user.getPublicProfile(),
      })
    } catch (error) {
      console.error("Profile update error:", error)
      res.status(500).json({
        error: "Failed to update profile",
        message: "An error occurred while updating your profile",
      })
    }
  },
)

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("New password must contain at least one uppercase letter, one lowercase letter, and one number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { currentPassword, newPassword } = req.body

      // Find user with password
      const user = await User.findById(req.user.userId).select("+password")
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        })
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: "Invalid current password",
        })
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({
        message: "Password changed successfully",
      })
    } catch (error) {
      console.error("Change password error:", error)
      res.status(500).json({
        error: "Failed to change password",
        message: "An error occurred while changing your password",
      })
    }
  },
)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post("/logout", auth, (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // In production, you might want to implement token blacklisting
  res.json({
    message: "Logged out successfully",
  })
})

/**
 * @route   POST /api/auth/seed
 * @desc    Seed database with sample data (Development only)
 * @access  Public
 */
router.post("/seed", async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        error: "Seeding not allowed in production",
      })
    }

    // Clear existing data
    await User.deleteMany({})
    await Listing.deleteMany({})
    await Booking.deleteMany({})

    console.log("🗑️  Cleared existing data")

    // Create sample users
    const users = await User.create([
      {
        name: "John Doe",
        email: "demo@user.com",
        password: "password123",
        role: "user",
        verified: true,
        phone: "+1-555-0123",
        bio: "Love traveling and exploring new places!",
      },
      {
        name: "Jane Smith",
        email: "demo@host.com",
        password: "password123",
        role: "host",
        verified: true,
        phone: "+1-555-0124",
        bio: "Experienced host with 5+ years of hospitality experience",
        hostInfo: {
          joinedAsHost: new Date("2019-01-01"),
          superhost: true,
          responseRate: 98,
          responseTime: "within an hour",
          languages: ["English", "Spanish"],
          hostingExperience: "I've been hosting travelers for over 5 years and love sharing my city with visitors!",
        },
      },
      {
        name: "Mike Johnson",
        email: "mike@host.com",
        password: "password123",
        role: "host",
        verified: true,
        phone: "+1-555-0125",
        bio: "Property investor and host",
        hostInfo: {
          joinedAsHost: new Date("2020-06-01"),
          superhost: false,
          responseRate: 95,
          responseTime: "within a few hours",
          languages: ["English"],
          hostingExperience: "New to hosting but passionate about providing great experiences!",
        },
      },
    ])

    console.log("👥 Created sample users")

    // Create sample listings
    const listings = await Listing.create([
      {
        title: "Luxury Villa with Ocean View",
        description:
          "Experience the ultimate luxury in this stunning villa overlooking the Pacific Ocean. This spacious property features floor-to-ceiling windows, a private infinity pool, and direct beach access. The villa includes 4 bedrooms, each with an en-suite bathroom, a fully equipped gourmet kitchen, and a spacious living area perfect for entertaining.",
        type: "Villa",
        price: 350,
        location: {
          address: "123 Ocean Drive",
          city: "Malibu",
          state: "California",
          country: "United States",
          zipCode: "90265",
          coordinates: { lat: 34.0259, lng: -118.7798 },
          neighborhood: "Point Dume",
        },
        bedrooms: 4,
        bathrooms: 4,
        maxGuests: 8,
        beds: 4,
        squareFootage: 3500,
        amenities: ["wifi", "kitchen", "pool", "parking", "airConditioning", "oceanView", "beachfront", "bbqGrill"],
        images: [
          { url: "/placeholder.svg?height=600&width=800&text=Ocean Villa", isPrimary: true },
          { url: "/placeholder.svg?height=400&width=600&text=Living Room" },
          { url: "/placeholder.svg?height=400&width=600&text=Master Bedroom" },
          { url: "/placeholder.svg?height=400&width=600&text=Pool Area" },
        ],
        host: users[1]._id,
        rating: {
          overall: 4.9,
          cleanliness: 5.0,
          accuracy: 4.8,
          checkIn: 5.0,
          communication: 4.9,
          location: 5.0,
          value: 4.7,
        },
        reviewCount: 23,
        featured: true,
        instantBook: true,
        status: "active",
        verified: true,
        houseRules: {
          checkIn: "4:00 PM",
          checkOut: "11:00 AM",
          smokingAllowed: false,
          petsAllowed: true,
          partiesAllowed: false,
          quietHours: { start: "10:00 PM", end: "8:00 AM" },
        },
      },
      {
        title: "Modern Downtown Apartment",
        description:
          "Stay in the heart of the city in this stylish modern apartment. Located in the downtown district, you'll be steps away from restaurants, shopping, and entertainment. The apartment features contemporary design, high-end appliances, and stunning city views.",
        type: "Apartment",
        price: 120,
        location: {
          address: "456 Main Street",
          city: "New York",
          state: "New York",
          country: "United States",
          zipCode: "10001",
          coordinates: { lat: 40.7128, lng: -74.006 },
          neighborhood: "Midtown",
        },
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        beds: 1,
        squareFootage: 800,
        amenities: ["wifi", "kitchen", "airConditioning", "elevator", "cityView", "workspace"],
        images: [
          { url: "/placeholder.svg?height=600&width=800&text=Downtown Apartment", isPrimary: true },
          { url: "/placeholder.svg?height=400&width=600&text=Living Area" },
          { url: "/placeholder.svg?height=400&width=600&text=Bedroom" },
          { url: "/placeholder.svg?height=400&width=600&text=Kitchen" },
        ],
        host: users[2]._id,
        rating: {
          overall: 4.7,
          cleanliness: 4.8,
          accuracy: 4.6,
          checkIn: 4.9,
          communication: 4.7,
          location: 4.9,
          value: 4.5,
        },
        reviewCount: 15,
        featured: false,
        instantBook: true,
        status: "active",
        verified: true,
      },
      {
        title: "Cozy Mountain Cabin",
        description:
          "Escape to this charming cabin nestled in the mountains. Perfect for a romantic getaway or a peaceful retreat from the city. Enjoy hiking trails, stunning views, and cozy evenings by the fireplace. The cabin features rustic charm with modern amenities.",
        type: "Cabin",
        price: 95,
        location: {
          address: "789 Pine Road",
          city: "Aspen",
          state: "Colorado",
          country: "United States",
          zipCode: "81611",
          coordinates: { lat: 39.1911, lng: -106.8175 },
          neighborhood: "West End",
        },
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        beds: 2,
        squareFootage: 1200,
        amenities: ["wifi", "kitchen", "fireplace", "parking", "mountainView", "petFriendly", "bbqGrill"],
        images: [
          { url: "/placeholder.svg?height=600&width=800&text=Mountain Cabin", isPrimary: true },
          { url: "/placeholder.svg?height=400&width=600&text=Living Room" },
          { url: "/placeholder.svg?height=400&width=600&text=Bedroom" },
          { url: "/placeholder.svg?height=400&width=600&text=Mountain View" },
        ],
        host: users[1]._id,
        rating: {
          overall: 4.8,
          cleanliness: 4.9,
          accuracy: 4.7,
          checkIn: 4.8,
          communication: 4.9,
          location: 4.8,
          value: 4.8,
        },
        reviewCount: 18,
        featured: true,
        instantBook: false,
        status: "active",
        verified: true,
      },
    ])

    console.log("🏠 Created sample listings")

    res.json({
      message: "Database seeded successfully",
      data: {
        users: users.length,
        listings: listings.length,
      },
      credentials: {
        user: { email: "demo@user.com", password: "password123" },
        host: { email: "demo@host.com", password: "password123" },
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    res.status(500).json({
      error: "Failed to seed database",
      message: error.message,
    })
  }
})

module.exports = router
