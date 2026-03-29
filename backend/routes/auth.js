const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { awardPoints, awardBadge } = require("../utils/gamification");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || "7d",
  });

// ─── POST /api/auth/register ────────────────────────────────
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["citizen", "volunteer", "ngo"])
      .withMessage("Invalid role"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password, role, phone, organizationName, registrationNumber, city, state } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already registered." });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || "citizen",
        phone,
        organizationName,
        registrationNumber,
        city,
        state,
      });

      // Award profile completion points if key fields filled
      if (phone && city) {
        await awardPoints(user._id, "profile_complete");
        await awardBadge(user._id, "profile_complete");
      }

      const token = signToken(user._id);
      res.status(201).json({
        success: true,
        message: "Account created successfully.",
        token,
        user: user.toPublicProfile(),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/auth/login ────────────────────────────────────
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
      }

      if (!user.isActive) {
        return res.status(403).json({ success: false, message: "Account has been deactivated." });
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      await awardPoints(user._id, "daily_login");

      const token = signToken(user._id);
      res.json({
        success: true,
        token,
        user: user.toPublicProfile(),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: req.user.toPublicProfile() });
});

// ─── PUT /api/auth/change-password ────────────────────────────
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password min 6 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const user = await User.findById(req.user._id).select("+password");
      if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).json({ success: false, message: "Current password is incorrect." });
      }

      user.password = req.body.newPassword;
      await user.save();

      res.json({ success: true, message: "Password updated successfully." });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
