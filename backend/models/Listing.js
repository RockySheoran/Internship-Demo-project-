/**
 * Listing Model
 * Defines the property listing schema for MongoDB
 */

const mongoose = require("mongoose")

const listingSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description must be at least 50 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    // Property Details
    type: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["Apartment", "House", "Villa", "Cabin", "Loft", "Townhouse", "Condo", "Bungalow", "Studio", "Other"],
    },

    category: {
      type: String,
      enum: ["Entire place", "Private room", "Shared room"],
      default: "Entire place",
    },

    // Pricing
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least $1"],
      max: [10000, "Price cannot exceed $10,000 per night"],
    },

    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"],
    },

    // Location Information
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
          min: -90,
          max: 90,
        },
        lng: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
      neighborhood: String,
      landmarks: [String],
    },

    // Property Specifications
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
      max: [20, "Maximum 20 bedrooms allowed"],
    },

    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0.5, "Must have at least half bathroom"],
      max: [20, "Maximum 20 bathrooms allowed"],
    },

    maxGuests: {
      type: Number,
      required: [true, "Maximum guests is required"],
      min: [1, "Must accommodate at least 1 guest"],
      max: [50, "Maximum 50 guests allowed"],
    },

    beds: {
      type: Number,
      min: [0, "Beds cannot be negative"],
      max: [50, "Maximum 50 beds allowed"],
    },

    squareFootage: {
      type: Number,
      min: [50, "Minimum 50 square feet"],
    },

    // Amenities
    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "kitchen",
          "washer",
          "dryer",
          "airConditioning",
          "heating",
          "pool",
          "hotTub",
          "gym",
          "parking",
          "elevator",
          "balcony",
          "patio",
          "fireplace",
          "tv",
          "workspace",
          "petFriendly",
          "smokingAllowed",
          "wheelchairAccessible",
          "familyFriendly",
          "beachfront",
          "mountainView",
          "cityView",
          "lakeView",
          "oceanView",
          "gardenView",
          "breakfast",
          "lunch",
          "dinner",
          "bbqGrill",
          "outdoorSeating",
          "indoorFireplace",
          "sauna",
          "steamRoom",
          "gameRoom",
          "library",
          "musicRoom",
        ],
      },
    ],

    // House Rules
    houseRules: {
      checkIn: {
        type: String,
        default: "3:00 PM",
      },
      checkOut: {
        type: String,
        default: "11:00 AM",
      },
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      partiesAllowed: {
        type: Boolean,
        default: false,
      },
      quietHours: {
        start: String,
        end: String,
      },
      additionalRules: [String],
    },

    // Media
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    videos: [
      {
        url: String,
        caption: String,
        thumbnail: String,
      },
    ],

    // Host Information
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },

    coHosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Booking Settings
    instantBook: {
      type: Boolean,
      default: false,
    },

    minimumStay: {
      type: Number,
      default: 1,
      min: [1, "Minimum stay must be at least 1 night"],
    },

    maximumStay: {
      type: Number,
      default: 365,
      min: [1, "Maximum stay must be at least 1 night"],
    },

    advanceNotice: {
      type: String,
      enum: ["same day", "1 day", "2 days", "3 days", "7 days"],
      default: "1 day",
    },

    preparationTime: {
      type: Number,
      default: 1,
      min: [0, "Preparation time cannot be negative"],
    },

    // Availability
    availability: {
      calendar: [
        {
          date: Date,
          available: Boolean,
          price: Number,
          minimumStay: Number,
        },
      ],
      blockedDates: [Date],
      seasonalPricing: [
        {
          startDate: Date,
          endDate: Date,
          priceMultiplier: Number,
          description: String,
        },
      ],
    },

    // Reviews and Ratings
    rating: {
      overall: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      cleanliness: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      accuracy: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      checkIn: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      communication: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      location: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      value: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Status and Visibility
    status: {
      type: String,
      enum: ["draft", "pending", "active", "inactive", "suspended"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    // Statistics
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      bookings: {
        type: Number,
        default: 0,
      },
      favorites: {
        type: Number,
        default: 0,
      },
      inquiries: {
        type: Number,
        default: 0,
      },
    },

    // SEO and Marketing
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    lastBookedAt: Date,
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better query performance
listingSchema.index({ "location.city": 1, "location.country": 1 })
listingSchema.index({ price: 1 })
listingSchema.index({ type: 1 })
listingSchema.index({ maxGuests: 1 })
listingSchema.index({ amenities: 1 })
listingSchema.index({ "rating.overall": -1 })
listingSchema.index({ featured: -1, createdAt: -1 })
listingSchema.index({ host: 1 })
listingSchema.index({ status: 1 })
listingSchema.index({ "location.coordinates": "2dsphere" })

// Virtual for primary image
listingSchema.virtual("primaryImage").get(function () {
  const primaryImg = this.images.find((img) => img.isPrimary)
  return primaryImg ? primaryImg.url : this.images[0] ? this.images[0].url : null
})

// Virtual for location string
listingSchema.virtual("locationString").get(function () {
  return `${this.location.city}, ${this.location.country}`
})

// Virtual for average rating
listingSchema.virtual("averageRating").get(function () {
  if (this.reviewCount === 0) return 0

  const ratings = [
    this.rating.cleanliness,
    this.rating.accuracy,
    this.rating.checkIn,
    this.rating.communication,
    this.rating.location,
    this.rating.value,
  ]

  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
})

// Pre-save middleware
listingSchema.pre("save", function (next) {
  this.updatedAt = Date.now()

  // Ensure at least one image is marked as primary
  if (this.images.length > 0 && !this.images.some((img) => img.isPrimary)) {
    this.images[0].isPrimary = true
  }

  next()
})

// Static method to find available listings
listingSchema.statics.findAvailable = function (checkIn, checkOut, guests) {
  const query = {
    status: "active",
    maxGuests: { $gte: guests },
  }

  // Add date availability check here
  // This would involve checking against bookings collection

  return this.find(query)
}

// Static method to search listings
listingSchema.statics.search = function (searchParams) {
  const {
    location,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    type,
    amenities,
    page = 1,
    limit = 20,
  } = searchParams

  const query = { status: "active" }

  // Location search
  if (location) {
    const locationRegex = new RegExp(location, "i")
    query.$or = [
      { "location.city": locationRegex },
      { "location.country": locationRegex },
      { "location.state": locationRegex },
      { "location.neighborhood": locationRegex },
    ]
  }

  // Guest capacity
  if (guests) {
    query.maxGuests = { $gte: Number.parseInt(guests) }
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number.parseInt(minPrice)
    if (maxPrice) query.price.$lte = Number.parseInt(maxPrice)
  }

  // Property type
  if (type) {
    query.type = type
  }

  // Amenities
  if (amenities && amenities.length > 0) {
    query.amenities = { $in: amenities }
  }

  const skip = (page - 1) * limit

  return this.find(query)
    .populate("host", "name avatar rating.overall")
    .sort({ featured: -1, "rating.overall": -1, createdAt: -1 })
    .skip(skip)
    .limit(Number.parseInt(limit))
}

module.exports = mongoose.model("Listing", listingSchema)
