const mongoose = require("mongoose");

// Each status change is logged with who changed it and when
const statusLogSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["reported", "verified", "accepted", "on_the_way", "rescued", "closed", "rejected"],
    required: true,
  },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: { type: String, maxlength: 500 },
  timestamp: { type: Date, default: Date.now },
});

const rescueCaseSchema = new mongoose.Schema(
  {
    // ── Identification ─────────────────────────────────────
    caseId: { type: String, unique: true }, // auto-generated e.g. RQ-2024-00042

    // ── Reported By ────────────────────────────────────────
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactPhone: { type: String }, // reporter's contact at scene

    // ── Animal Details ─────────────────────────────────────
    animalType: {
      type: String,
      enum: ["dog", "cat", "bird", "cow", "monkey", "reptile", "other"],
      required: [true, "Animal type is required"],
    },
    animalCount: { type: Number, default: 1, min: 1 },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    conditionTags: [String], // e.g. ["injured", "bleeding", "unconscious", "malnourished"]

    // ── Urgency & AI ───────────────────────────────────────
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    aiSeverityScore: { type: Number, min: 0, max: 100 }, // from AI module
    aiConditionExtracted: [String], // AI-extracted conditions from description
    isDuplicate: { type: Boolean, default: false },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: "RescueCase" },

    // ── Location ───────────────────────────────────────────
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Location coordinates are required"],
      },
    },
    address: { type: String, maxlength: 300 }, // human-readable address
    landmark: { type: String, maxlength: 200 },
    city: String,
    state: String,

    // ── Media ──────────────────────────────────────────────
    media: [
      {
        url: String,
        publicId: String, // Cloudinary public_id for deletion
        type: { type: String, enum: ["image", "video"] },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Status & Workflow ──────────────────────────────────
    status: {
      type: String,
      enum: ["reported", "verified", "accepted", "on_the_way", "rescued", "closed", "rejected"],
      default: "reported",
    },
    statusLog: [statusLogSchema],

    // ── Assignment ─────────────────────────────────────────
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // NGO or volunteer
    assignedTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ── Resolution ─────────────────────────────────────────
    resolutionNote: { type: String, maxlength: 500 },
    rescuedAt: Date,
    closedAt: Date,

    // ── Multilingual ───────────────────────────────────────
    originalLanguage: { type: String, default: "en" },
    translatedDescription: { type: Map, of: String }, // { hi: "...", ta: "..." }

    // ── First Aid ──────────────────────────────────────────
    firstAidGuidance: { type: String }, // RAG-generated, stored after fetch

    // ── Feedback ───────────────────────────────────────────
    reporterRating: { type: Number, min: 1, max: 5 }, // reporter rates the rescue
    reporterFeedback: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

// Geo index for location-based queries
rescueCaseSchema.index({ location: "2dsphere" });
rescueCaseSchema.index({ status: 1, urgencyLevel: 1 });
rescueCaseSchema.index({ reportedBy: 1 });
rescueCaseSchema.index({ assignedTo: 1 });

// Auto-generate caseId before saving
rescueCaseSchema.pre("save", async function (next) {
  if (!this.caseId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("RescueCase").countDocuments();
    this.caseId = `RQ-${year}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("RescueCase", rescueCaseSchema);
