/**
 * Authentication Routes
 * Comprehensive authentication endpoints with validation
 */

const express = require("express")
const { body } = require("express-validator")
const auth = require("../middleware/auth")
const {
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
} = require("../controllers/authController")

const router = express.Router()

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),

  body("role").optional().isIn(["user", "host"]).withMessage("Role must be either 'user' or 'host'"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
]

const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  body("phone")
    .optional()
    .matches(/^\+?[\d\s\-()]+$/)
    .withMessage("Please provide a valid phone number"),

  body("bio").optional().isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
]

const changePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
]

// Routes
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.get("/me", auth, getProfile)
router.put("/profile", auth, updateProfileValidation, updateProfile)
router.post("/change-password", auth, changePasswordValidation, changePassword)
router.post("/refresh-token", refreshToken)
router.post("/logout", auth, logout)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

// Seed route for development
router.post("/seed", async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        error: "Seeding not allowed in production",
      })
    }

    const User = require("../models/User")
    const Listing = require("../models/Listing")
    const Booking = require("../models/Booking")
    const Review = require("../models/Review")

    // Clear existing data
    await Promise.all([User.deleteMany({}), Listing.deleteMany({}), Booking.deleteMany({}), Review.deleteMany({})])

    console.log("🗑️  Cleared existing data")

    // Create sample users
    const users = await User.create([
      {
        name: "Demo User",
        email: "demo@user.com",
        password: "password123",
        role: "user",
        verified: true,
        phone: "+1-555-0123",
        bio: "Love traveling and exploring new places around the world!",
        preferences: {
          currency: "USD",
          language: "en",
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
      },
      {
        name: "Demo Host",
        email: "demo@host.com",
        password: "password123",
        role: "host",
        verified: true,
        phone: "+1-555-0124",
        bio: "Experienced host with 5+ years of hospitality experience. I love sharing my properties with travelers from around the world.",
        hostInfo: {
          joinedAsHost: new Date("2019-01-01"),
          superhost: true,
          responseRate: 98,
          responseTime: "within an hour",
          languages: ["English", "Spanish", "French"],
          hostingExperience:
            "I've been hosting travelers for over 5 years and love sharing my city with visitors! I'm always available to help make your stay perfect.",
        },
        preferences: {
          currency: "USD",
          language: "en",
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        },
      },
      {
        name: "Sarah Johnson",
        email: "sarah@host.com",
        password: "password123",
        role: "host",
        verified: true,
        phone: "+1-555-0125",
        bio: "Property investor and passionate host who loves creating memorable experiences for guests.",
        hostInfo: {
          joinedAsHost: new Date("2020-06-01"),
          superhost: false,
          responseRate: 95,
          responseTime: "within a few hours",
          languages: ["English"],
          hostingExperience: "New to hosting but passionate about providing great experiences for all my guests!",
        },
      },
    ])

    console.log("👥 Created sample users")

    // Create sample listings
    const listings = await Listing.create([
      {
        title: "Luxury Ocean View Villa in Malibu",
        description:
          "Experience the ultimate luxury in this stunning villa overlooking the Pacific Ocean. This spacious property features floor-to-ceiling windows, a private infinity pool, and direct beach access. The villa includes 4 bedrooms, each with an en-suite bathroom, a fully equipped gourmet kitchen, and a spacious living area perfect for entertaining. Enjoy breathtaking sunsets from the expansive terrace or take a short walk to the beach for a day of sun and surf.",
        type: "Villa",
        category: "Entire place",
        price: 350,
        currency: "USD",
        location: {
          address: "123 Ocean Drive",
          city: "Malibu",
          state: "California",
          country: "United States",
          zipCode: "90265",
          coordinates: { lat: 34.0259, lng: -118.7798 },
          neighborhood: "Point Dume",
          landmarks: ["Malibu Beach", "Point Dume State Beach", "Malibu Pier"],
        },
        bedrooms: 4,
        bathrooms: 4,
        maxGuests: 8,
        beds: 4,
        squareFootage: 3500,
        amenities: [
          "wifi",
          "kitchen",
          "pool",
          "parking",
          "airConditioning",
          "oceanView",
          "beachfront",
          "bbqGrill",
          "hotTub",
          "fireplace",
        ],
        images: [
          {
            url: "/placeholder.svg?height=600&width=800&text=Ocean Villa",
            isPrimary: true,
            caption: "Ocean view from living room",
          },
          { url: "/placeholder.svg?height=400&width=600&text=Living Room", caption: "Spacious living area" },
          {
            url: "/placeholder.svg?height=400&width=600&text=Master Bedroom",
            caption: "Master bedroom with ocean view",
          },
          { url: "/placeholder.svg?height=400&width=600&text=Pool Area", caption: "Private infinity pool" },
          { url: "/placeholder.svg?height=400&width=600&text=Kitchen", caption: "Gourmet kitchen" },
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
          additionalRules: ["No smoking anywhere on the property", "Maximum 2 pets allowed"],
        },
        minimumStay: 2,
        maximumStay: 30,
        advanceNotice: "2 days",
        preparationTime: 1,
      },
      {
        title: "Modern Downtown Apartment with City Views",
        description:
          "Stay in the heart of the city in this stylish modern apartment. Located in the downtown district, you'll be steps away from restaurants, shopping, and entertainment. The apartment features contemporary design, high-end appliances, and stunning city views from the 25th floor. Perfect for business travelers or couples looking to explore the city.",
        type: "Apartment",
        category: "Entire place",
        price: 120,
        currency: "USD",
        location: {
          address: "456 Main Street",
          city: "New York",
          state: "New York",
          country: "United States",
          zipCode: "10001",
          coordinates: { lat: 40.7128, lng: -74.006 },
          neighborhood: "Midtown Manhattan",
          landmarks: ["Times Square", "Empire State Building", "Central Park"],
        },
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        beds: 1,
        squareFootage: 800,
        amenities: ["wifi", "kitchen", "airConditioning", "elevator", "cityView", "workspace", "tv", "washer", "dryer"],
        images: [
          {
            url: "/placeholder.svg?height=600&width=800&text=Downtown Apartment",
            isPrimary: true,
            caption: "City view from living room",
          },
          { url: "/placeholder.svg?height=400&width=600&text=Living Area", caption: "Modern living space" },
          { url: "/placeholder.svg?height=400&width=600&text=Bedroom", caption: "Comfortable bedroom" },
          { url: "/placeholder.svg?height=400&width=600&text=Kitchen", caption: "Fully equipped kitchen" },
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
        houseRules: {
          checkIn: "3:00 PM",
          checkOut: "11:00 AM",
          smokingAllowed: false,
          petsAllowed: false,
          partiesAllowed: false,
          quietHours: { start: "10:00 PM", end: "8:00 AM" },
        },
        minimumStay: 1,
        maximumStay: 14,
        advanceNotice: "1 day",
        preparationTime: 0,
      },
      {
        title: "Cozy Mountain Cabin Retreat",
        description:
          "Escape to this charming cabin nestled in the mountains. Perfect for a romantic getaway or a peaceful retreat from the city. Enjoy hiking trails, stunning views, and cozy evenings by the fireplace. The cabin features rustic charm with modern amenities, including a fully equipped kitchen, comfortable bedding, and a private hot tub on the deck.",
        type: "Cabin",
        category: "Entire place",
        price: 95,
        currency: "USD",
        location: {
          address: "789 Pine Road",
          city: "Aspen",
          state: "Colorado",
          country: "United States",
          zipCode: "81611",
          coordinates: { lat: 39.1911, lng: -106.8175 },
          neighborhood: "West End",
          landmarks: ["Aspen Mountain", "Maroon Bells", "Independence Pass"],
        },
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        beds: 2,
        squareFootage: 1200,
        amenities: [
          "wifi",
          "kitchen",
          "fireplace",
          "parking",
          "mountainView",
          "petFriendly",
          "bbqGrill",
          "hotTub",
          "heating",
        ],
        images: [
          {
            url: "/placeholder.svg?height=600&width=800&text=Mountain Cabin",
            isPrimary: true,
            caption: "Cabin exterior with mountain view",
          },
          { url: "/placeholder.svg?height=400&width=600&text=Living Room", caption: "Cozy living room with fireplace" },
          { url: "/placeholder.svg?height=400&width=600&text=Bedroom", caption: "Comfortable mountain bedroom" },
          { url: "/placeholder.svg?height=400&width=600&text=Hot Tub", caption: "Private hot tub on deck" },
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
        houseRules: {
          checkIn: "4:00 PM",
          checkOut: "10:00 AM",
          smokingAllowed: false,
          petsAllowed: true,
          partiesAllowed: false,
          quietHours: { start: "9:00 PM", end: "8:00 AM" },
          additionalRules: ["Respect wildlife and nature", "Clean up after pets"],
        },
        minimumStay: 2,
        maximumStay: 21,
        advanceNotice: "3 days",
        preparationTime: 1,
      },
    ])

    console.log("🏠 Created sample listings")

    res.json({
      success: true,
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
      success: false,
      error: "Failed to seed database",
      message: error.message,
    })
  }
})

module.exports = router
