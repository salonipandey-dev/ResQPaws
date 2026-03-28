const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ── Core Identity ──────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      maxlength: 15,
    },

    // ── Role ───────────────────────────────────────────────
    role: {
      type: String,
      enum: ["citizen", "volunteer", "ngo", "admin"],
      default: "citizen",
    },

    // ── Profile ────────────────────────────────────────────
    avatar: { type: String, default: null },
    bio: { type: String, maxlength: 300 },
    city: { type: String, maxlength: 100 },
    state: { type: String, maxlength: 100 },

    // ── NGO-specific fields ────────────────────────────────
    organizationName: { type: String, maxlength: 120 },
    registrationNumber: { type: String },
    isVerified: { type: Boolean, default: false }, // Admin verifies NGOs/volunteers

    // ── Volunteer-specific ─────────────────────────────────
    skills: [String], // e.g. ["veterinary", "transport", "first-aid"]
    isAvailable: { type: Boolean, default: true },

    // ── Gamification ──────────────────────────────────────
    rescuePoints: { type: Number, default: 0 },
    trustScore: { type: Number, default: 50, min: 0, max: 100 },
    badges: [
      {
        name: String,
        icon: String,
        awardedAt: { type: Date, default: Date.now },
      },
    ],
    totalReports: { type: Number, default: 0 },
    verifiedReports: { type: Number, default: 0 },
    totalRescues: { type: Number, default: 0 }, // for volunteers/NGOs

    // ── Account Status ─────────────────────────────────────
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// Public profile (strips sensitive data)
userSchema.methods.toPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.registrationNumber;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
