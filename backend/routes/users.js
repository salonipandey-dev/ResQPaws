const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Reward = require("../models/Reward");
const RescueCase = require("../models/RescueCase");
const { protect } = require("../middleware/auth");
const { uploadAvatar } = require("../config/cloudinary");
const { parsePositiveInt } = require("../utils/request");

const respondNotFound = (res, resource = "User") =>
  res.status(404).json({ success: false, message: `${resource} not found.` });

// ─── GET /api/users/leaderboard ─────────────────────────────
router.get("/leaderboard", protect, async (req, res, next) => {
  try {
    const { city, state, limit = 10 } = req.query;
    const topN = parsePositiveInt(limit, 10, { min: 1, max: 100 });
    const filter = { isActive: true, role: { $ne: "admin" } };
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");

    const leaders = await User.find(filter)
      .sort({ rescuePoints: -1 })
      .limit(topN)
      .select("name avatar role rescuePoints trustScore totalReports totalRescues badges city state organizationName");

    res.json({ success: true, data: leaders });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:id ──────────────────────────── Public profile
router.get("/:id", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -registrationNumber -email"
    );
    if (!user) return respondNotFound(res);

    const recentCases = await RescueCase.find({ reportedBy: user._id, status: "rescued" })
      .sort("-rescuedAt")
      .limit(5)
      .select("caseId animalType city rescuedAt urgencyLevel");

    res.json({ success: true, data: { ...user.toObject(), recentCases } });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/users/profile ──────────────────────── Update own profile
router.put("/profile", protect, async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "bio", "city", "state", "skills", "isAvailable", "organizationName"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return respondNotFound(res);

    res.json({ success: true, data: user.toPublicProfile() });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/users/avatar ──────────────────────── Upload avatar
router.post("/avatar", protect, uploadAvatar.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path },
      { new: true }
    );
    if (!user) return respondNotFound(res);

    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:id/rewards ─────────────────── Reward history
router.get("/:id/rewards", protect, async (req, res, next) => {
  try {
    const rewards = await Reward.find({ user: req.params.id })
      .sort("-createdAt")
      .limit(50)
      .populate("relatedCase", "caseId animalType");

    res.json({ success: true, data: rewards });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
