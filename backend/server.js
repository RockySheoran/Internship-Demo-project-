const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/stayfinder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "host", "admin"], default: "user" },
  avatar: String,
  phone: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

// Listing Schema
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    country: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  amenities: [String],
  images: [String],
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  instantBook: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

// Booking Schema
const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  specialRequests: String,
  createdAt: { type: Date, default: Date.now },
})

// Review Schema
const reviewSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now },
})

// Models
const User = mongoose.model("User", userSchema)
const Listing = mongoose.model("Listing", listingSchema)
const Booking = mongoose.model("Booking", bookingSchema)
const Review = mongoose.model("Review", reviewSchema)

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

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

// AUTH ROUTES

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    })

    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Server error during registration" })
  }
})

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Server error during login" })
  }
})

// Get current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// LISTING ROUTES

// Get all listings with filters
app.get("/api/listings", async (req, res) => {
  try {
    const {
      location,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      type,
      amenities,
      featured,
      limit = 50,
      page = 1,
    } = req.query

    const query = { available: true }

    // Location filter
    if (location) {
      const locationRegex = new RegExp(location, "i")
      query.$or = [
        { "location.city": locationRegex },
        { "location.country": locationRegex },
        { "location.state": locationRegex },
      ]
    }

    // Guest filter
    if (guests) {
      query.maxGuests = { $gte: Number.parseInt(guests) }
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) query.price.$lte = Number.parseInt(maxPrice)
    }

    // Property type filter
    if (type) {
      query.type = new RegExp(type, "i")
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities]
      query.amenities = { $in: amenitiesArray }
    }

    // Featured filter
    if (featured === "true") {
      query.featured = true
    }

    // Date availability check (simplified - in production, check against bookings)
    if (checkIn && checkOut) {
      // This is a simplified check - in production, you'd check against the bookings collection
      const existingBookings = await Booking.find({
        $or: [
          {
            checkIn: { $lte: new Date(checkOut) },
            checkOut: { $gte: new Date(checkIn) },
          },
        ],
        status: { $in: ["confirmed", "pending"] },
      }).distinct("listing")

      query._id = { $nin: existingBookings }
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const listings = await Listing.find(query)
      .populate("host", "name avatar")
      .sort({ featured: -1, createdAt: -1 })
      .limit(Number.parseInt(limit))
      .skip(skip)

    const total = await Listing.countDocuments(query)

    res.json({
      listings,
      total,
      page: Number.parseInt(page),
      totalPages: Math.ceil(total / Number.parseInt(limit)),
    })
  } catch (error) {
    console.error("Get listings error:", error)
    res.status(500).json({ error: "Server error while fetching listings" })
  }
})

// Get single listing
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("host", "name avatar phone createdAt")

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    // Get reviews for this listing
    const reviews = await Review.find({ listing: req.params.id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })

    res.json({
      ...listing.toObject(),
      reviews,
    })
  } catch (error) {
    console.error("Get listing error:", error)
    res.status(500).json({ error: "Server error while fetching listing" })
  }
})

// Create listing (host only)
app.post("/api/listings", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description, type, price, location, bedrooms, bathrooms, maxGuests, amenities } = req.body

    // Parse location if it's a string
    const parsedLocation = typeof location === "string" ? JSON.parse(location) : location
    const parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities

    // Get uploaded file paths
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : []

    const listing = new Listing({
      title,
      description,
      type,
      price: Number.parseFloat(price),
      location: parsedLocation,
      bedrooms: Number.parseInt(bedrooms),
      bathrooms: Number.parseInt(bathrooms),
      maxGuests: Number.parseInt(maxGuests),
      amenities: parsedAmenities || [],
      images,
      host: req.user.userId,
    })

    await listing.save()

    // Update user role to host if not already
    await User.findByIdAndUpdate(req.user.userId, { role: "host" })

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    })
  } catch (error) {
    console.error("Create listing error:", error)
    res.status(500).json({ error: "Server error while creating listing" })
  }
})

// Update listing (host only)
app.put("/api/listings/:id", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    // Check if user is the host
    if (listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to update this listing" })
    }

    const updates = { ...req.body }

    // Handle location and amenities parsing
    if (updates.location && typeof updates.location === "string") {
      updates.location = JSON.parse(updates.location)
    }
    if (updates.amenities && typeof updates.amenities === "string") {
      updates.amenities = JSON.parse(updates.amenities)
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`)
      updates.images = [...(listing.images || []), ...newImages]
    }

    Object.assign(listing, updates)
    await listing.save()

    res.json({
      message: "Listing updated successfully",
      listing,
    })
  } catch (error) {
    console.error("Update listing error:", error)
    res.status(500).json({ error: "Server error while updating listing" })
  }
})

// Delete listing (host only)
app.delete("/api/listings/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    // Check if user is the host
    if (listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this listing" })
    }

    await Listing.findByIdAndDelete(req.params.id)

    res.json({ message: "Listing deleted successfully" })
  } catch (error) {
    console.error("Delete listing error:", error)
    res.status(500).json({ error: "Server error while deleting listing" })
  }
})

// BOOKING ROUTES

// Create booking
app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests, specialRequests } = req.body

    // Validate listing exists
    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    // Check availability (simplified)
    const existingBooking = await Booking.findOne({
      listing: listingId,
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) },
        },
      ],
      status: { $in: ["confirmed", "pending"] },
    })

    if (existingBooking) {
      return res.status(400).json({ error: "Dates are not available" })
    }

    // Calculate total price
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    const totalPrice = listing.price * nights

    const booking = new Booking({
      listing: listingId,
      user: req.user.userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: Number.parseInt(guests),
      totalPrice,
      specialRequests,
    })

    await booking.save()

    // Populate the booking with listing and user details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("listing", "title images location price")
      .populate("user", "name email")

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ error: "Server error while creating booking" })
  }
})

// Get user bookings
app.get("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate("listing", "title images location price host")
      .sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ error: "Server error while fetching bookings" })
  }
})

// Get single booking
app.get("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("listing", "title images location price host")
      .populate("user", "name email phone")

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user.userId && booking.listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to view this booking" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({ error: "Server error while fetching booking" })
  }
})

// Update booking status
app.put("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body
    const booking = await Booking.findById(req.params.id).populate("listing")

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Check authorization (user can cancel, host can confirm/reject)
    const isUser = booking.user.toString() === req.user.userId
    const isHost = booking.listing.host.toString() === req.user.userId

    if (!isUser && !isHost) {
      return res.status(403).json({ error: "Not authorized to update this booking" })
    }

    // Validate status changes
    if (isUser && !["cancelled"].includes(status)) {
      return res.status(400).json({ error: "Users can only cancel bookings" })
    }

    if (isHost && !["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update" })
    }

    booking.status = status
    await booking.save()

    res.json({
      message: "Booking updated successfully",
      booking,
    })
  } catch (error) {
    console.error("Update booking error:", error)
    res.status(500).json({ error: "Server error while updating booking" })
  }
})

// REVIEW ROUTES

// Create review
app.post("/api/reviews", authenticateToken, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body

    // Check if user has a completed booking for this listing
    const booking = await Booking.findOne({
      listing: listingId,
      user: req.user.userId,
      status: "completed",
    })

    if (!booking) {
      return res.status(400).json({ error: "You can only review places you have stayed at" })
    }

    // Check if user already reviewed this listing
    const existingReview = await Review.findOne({
      listing: listingId,
      user: req.user.userId,
    })

    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this listing" })
    }

    const review = new Review({
      listing: listingId,
      user: req.user.userId,
      rating: Number.parseInt(rating),
      comment,
    })

    await review.save()

    // Update listing rating
    const reviews = await Review.find({ listing: listingId })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await Listing.findByIdAndUpdate(listingId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    })

    res.status(201).json({
      message: "Review created successfully",
      review,
    })
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({ error: "Server error while creating review" })
  }
})

// DASHBOARD ROUTES

// Host dashboard - get host's listings
app.get("/api/host/listings", authenticateToken, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.userId }).sort({ createdAt: -1 })

    res.json(listings)
  } catch (error) {
    console.error("Get host listings error:", error)
    res.status(500).json({ error: "Server error while fetching host listings" })
  }
})

// Host dashboard - get bookings for host's listings
app.get("/api/host/bookings", authenticateToken, async (req, res) => {
  try {
    const hostListings = await Listing.find({ host: req.user.userId }).select("_id")
    const listingIds = hostListings.map((listing) => listing._id)

    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate("listing", "title images")
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get host bookings error:", error)
    res.status(500).json({ error: "Server error while fetching host bookings" })
  }
})

// Seed data
app.post("/api/seed", async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Listing.deleteMany({})
    await Booking.deleteMany({})
    await Review.deleteMany({})

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 10)

    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        role: "host",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: hashedPassword,
        role: "host",
      },
    ])

    // Create sample listings
    const listings = await Listing.create([
      {
        title: "Luxury Villa with Ocean View",
        description: "Experience the ultimate luxury in this stunning villa overlooking the Pacific Ocean.",
        type: "Villa",
        price: 350,
        location: {
          address: "123 Ocean Drive",
          city: "Malibu",
          state: "California",
          country: "United States",
          coordinates: { lat: 34.0259, lng: -118.7798 },
        },
        bedrooms: 4,
        bathrooms: 4,
        maxGuests: 8,
        amenities: ["wifi", "pool", "parking", "airConditioning", "kitchen"],
        images: ["/placeholder.svg?height=600&width=800&text=Ocean Villa"],
        host: users[1]._id,
        rating: 4.9,
        reviewCount: 12,
        featured: true,
        instantBook: true,
      },
      {
        title: "Modern Downtown Apartment",
        description: "Stay in the heart of the city in this stylish modern apartment.",
        type: "Apartment",
        price: 120,
        location: {
          address: "456 Main Street",
          city: "New York",
          state: "New York",
          country: "United States",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        amenities: ["wifi", "airConditioning", "kitchen"],
        images: ["/placeholder.svg?height=600&width=800&text=Downtown Apartment"],
        host: users[2]._id,
        rating: 4.7,
        reviewCount: 8,
        featured: false,
        instantBook: true,
      },
    ])

    res.json({ message: "Database seeded successfully", users, listings })
  } catch (error) {
    console.error("Seed error:", error)
    res.status(500).json({ error: "Error seeding database" })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 API Documentation available at http://localhost:${PORT}/api`)
})

module.exports = app
