/**
 * StayFinder Backend Server
 * Production-ready Express.js server with comprehensive features
 */

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")

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
const searchRoutes = require("./routes/search")
const notificationRoutes = require("./routes/notifications")

// Import middleware
const errorHandler = require("./middleware/errorHandler")
const logger = require("./middleware/logger")
const auth = require("./middleware/auth")

// Create Express app
const app = express()

// Trust proxy for deployment
app.set("trust proxy", 1)

// Create necessary directories
const createDirectories = () => {
  const dirs = ["uploads", "uploads/listings", "uploads/users", "uploads/temp", "logs"]
  dirs.forEach((dir) => {
    const dirPath = path.join(__dirname, dir)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`📁 Created directory: ${dir}`)
    }
  })
}

createDirectories()

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
)

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"))
} else {
  app.use(morgan("dev"))
}

// Rate limiting
const createRateLimit = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  })

// General API rate limiting
app.use(
  "/api/",
  createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests per window
    "Too many requests from this IP, please try again later.",
  ),
)

// Stricter rate limiting for auth routes
app.use(
  "/api/auth/",
  createRateLimit(
    15 * 60 * 1000, // 15 minutes
    10, // 10 requests per window
    "Too many authentication attempts, please try again later.",
  ),
)

// Upload rate limiting
app.use(
  "/api/upload/",
  createRateLimit(
    60 * 60 * 1000, // 1 hour
    20, // 20 uploads per hour
    "Too many upload attempts, please try again later.",
  ),
)

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean)
        : ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

app.use(cors(corsOptions))

// Body parsing middleware
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  }),
)
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Static file serving with caching
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: process.env.NODE_ENV === "production" ? "1d" : "0",
    etag: true,
  }),
)

// Custom middleware
app.use(logger)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
})

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    message: "StayFinder API is running",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      listings: "/api/listings",
      bookings: "/api/bookings",
      users: "/api/users",
      reviews: "/api/reviews",
      upload: "/api/upload",
      dashboard: "/api/dashboard",
      search: "/api/search",
      notifications: "/api/notifications",
    },
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
app.use("/api/search", searchRoutes)
app.use("/api/notifications", notificationRoutes)

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    message: `The endpoint ${req.originalUrl} does not exist`,
    suggestion: "Check the API documentation for available endpoints",
    timestamp: new Date().toISOString(),
  })
})

// Global error handling middleware
app.use(errorHandler)

// Database connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/stayfinder"

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    }

    await mongoose.connect(mongoURI, options)

    console.log("✅ Connected to MongoDB successfully")
    console.log(`📊 Database: ${mongoose.connection.name}`)
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`)

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected")
    })

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected")
    })

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close()
        console.log("🔌 MongoDB connection closed through app termination")
        process.exit(0)
      } catch (error) {
        console.error("Error during graceful shutdown:", error)
        process.exit(1)
      }
    })
  } catch (error) {
    console.error(`❌ MongoDB connection failed (${retries} retries left):`, error.message)

    if (retries > 0) {
      console.log(`🔄 Retrying connection in 5 seconds...`)
      setTimeout(() => connectDB(retries - 1), 5000)
    } else {
      console.error("💀 All connection retries exhausted. Exiting...")
      process.exit(1)
    }
  }
}

// Start server
const PORT = process.env.PORT || 5000
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB()

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`)

      if (process.env.NODE_ENV !== "production") {
        console.log(`🌱 Seed database: POST to http://localhost:${PORT}/api/auth/seed`)
        console.log(`📚 API Docs: http://localhost:${PORT}/api/status`)
      }
    })

    // Handle server shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received, shutting down gracefully")
      server.close(() => {
        console.log("💤 Process terminated")
      })
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("❌ Unhandled Promise Rejection:", err)
  console.error("Promise:", promise)
  process.exit(1)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err)
  process.exit(1)
})

// Start the application
startServer()

module.exports = app
