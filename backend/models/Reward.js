const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["points", "badge", "trust_increase", "trust_decrease"],
      required: true,
    },
    points: { type: Number, default: 0 },
    badge: {
      name: String,
      icon: String, // emoji or icon key
      description: String,
    },
    reason: {
      type: String,
      enum: [
        "case_reported",
        "case_verified",
        "case_rescued",
        "first_rescue",
        "10_reports",
        "fake_report_penalty",
        "daily_login",
        "profile_complete",
        "top_rescuer",
      ],
    },
    relatedCase: { type: mongoose.Schema.Types.ObjectId, ref: "RescueCase" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
