/**
 * User Model
 * Defines the user schema for MongoDB with validation and methods
 */

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in queries by default
    },

    // User Role
    role: {
      type: String,
      enum: ["user", "host", "admin"],
      default: "user",
    },

    // Profile Information
    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number"],
    },

    dateOfBirth: {
      type: Date,
    },

    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    // Address Information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Account Status
    verified: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    // Verification Tokens
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Preferences
    preferences: {
      currency: {
        type: String,
        default: "USD",
      },
      language: {
        type: String,
        default: "en",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Host-specific Information
    hostInfo: {
      joinedAsHost: Date,
      superhost: {
        type: Boolean,
        default: false,
      },
      responseRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      responseTime: {
        type: String,
        enum: ["within an hour", "within a few hours", "within a day", "a few days or more"],
        default: "within a day",
      },
      languages: [String],
      hostingExperience: String,
    },

    // Statistics
    stats: {
      totalBookings: {
        type: Number,
        default: 0,
      },
      totalListings: {
        type: Number,
        default: 0,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },

    // Social Links
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },

    // Login Information
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ "address.city": 1 })
userSchema.index({ createdAt: -1 })

// Virtual for user's age
userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
})

// Virtual for full name display
userSchema.virtual("displayName").get(function () {
  return this.name || this.email.split("@")[0]
})

// Virtual for host status
userSchema.virtual("isHost").get(function () {
  return this.role === "host" || this.role === "admin"
})

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash password if it's been modified
  if (!this.isModified("password")) return next()

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Pre-save middleware to update timestamps
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error("Password comparison failed")
  }
}

// Instance method to generate auth token payload
userSchema.methods.getTokenPayload = function () {
  return {
    userId: this._id,
    email: this.email,
    role: this.role,
    name: this.name,
  }
}

// Instance method to get public profile
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject()
  delete user.password
  delete user.emailVerificationToken
  delete user.passwordResetToken
  return user
}

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Static method to find hosts
userSchema.statics.findHosts = function () {
  return this.find({ role: { $in: ["host", "admin"] } })
}

module.exports = mongoose.model("User", userSchema)
