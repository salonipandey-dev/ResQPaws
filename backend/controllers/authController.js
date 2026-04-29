const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const ApiError = require("../utils/apiError");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const ensureValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
};

exports.register = async (req, res, next) => {
  try {
    ensureValid(req);

    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) throw new ApiError(409, "Email already registered");

    // Public signup: only "user" or "ngo". Admin accounts must be created manually in the DB.
    const allowedRoles = ["user", "ngo"];
    const safeRole = allowedRoles.includes(role) ? role : "user";

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: safeRole,
    });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: user.toPublicProfile(),
    });
  } catch (err) {
    // Catch the rare race-condition dup-key
    if (err && err.code === 11000) {
      return next(new ApiError(409, "Email already registered"));
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    ensureValid(req);

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Admins must use the admin sign-in endpoint
    if (user.role === "admin") {
      throw new ApiError(403, "Please sign in via the admin portal.");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id.toString());
    res.json({ success: true, token, user: user.toPublicProfile() });
  } catch (err) {
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    ensureValid(req);

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    // Same generic error for missing user, wrong password, AND non-admin role
    // so attackers can't probe whether an email is an admin account.
    if (!user || !(await user.matchPassword(password)) || user.role !== "admin") {
      throw new ApiError(401, "Invalid admin credentials");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id.toString());
    res.json({ success: true, token, user: user.toPublicProfile() });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user.toPublicProfile() });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    ensureValid(req);
    const allowedFields = ["name", "phone", "city", "state", "bio"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user: user.toPublicProfile() });
  } catch (err) {
    next(err);
  }
};