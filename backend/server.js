/**
 * StayFinder Backend Server
 * Main server file for the StayFinder application
 * Handles API routes, middleware, and database connections
 */

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const listingRoutes = require("./routes/listings")
const bookingRoutes = require("./routes/bookings")
const userRoutes = require("./routes/users")
const reviewRoutes = require("./routes/reviews")
const uploadRoutes = require("./routes/upload")
const dashboardRoutes = require("./routes/dashboard")

// Import middleware
const errorHandler = require("./middleware/errorHandler")
const logger = require("./middleware/logger")

// Create Express app
const app = express()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log("📁 Created uploads directory")
}

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
})
app.use("/api/", limiter)

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
})
app.use("/api/auth/", authLimiter)

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Custom logging middleware
app.use(logger)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/listings", listingRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/dashboard", dashboardRoutes)

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "StayFinder API v1.0",
    documentation: "https://api-docs.stayfinder.com",
    endpoints: {
      auth: "/api/auth",
      listings: "/api/listings",
      bookings: "/api/bookings",
      users: "/api/users",
      reviews: "/api/reviews",
      upload: "/api/upload",
      dashboard: "/api/dashboard",
    },
    version: "1.0.0",
    status: "active",
  })
})

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    message: `The endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "/api/auth",
      "/api/listings",
      "/api/bookings",
      "/api/users",
      "/api/reviews",
      "/api/upload",
      "/api/dashboard",
    ],
  })
})

// Global error handling middleware
app.use(errorHandler)

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/stayfinder"

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("✅ Connected to MongoDB successfully")
    console.log(`📊 Database: ${mongoose.connection.name}`)

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected")
    })

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close()
      console.log("🔌 MongoDB connection closed through app termination")
      process.exit(0)
    })
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message)
    process.exit(1)
  }
}

// Start server
const PORT = process.env.PORT || 5000
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB()

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`)

      // Seed database in development
      if (process.env.NODE_ENV !== "production") {
        console.log("🌱 To seed database, POST to /api/auth/seed")
      }
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err)
  process.exit(1)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err)
  process.exit(1)
})

// Start the application
startServer()

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Models
const User = mongoose.model("User", require("./models/User"))
const Listing = mongoose.model("Listing", require("./models/Listing"))
const Booking = mongoose.model("Booking", require("./models/Booking"))
const Review = mongoose.model("Review", require("./models/Review"))

module.exports = app
