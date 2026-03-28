const express = require("express");
const router = express.Router();
const User = require("../models/User");
const RescueCase = require("../models/RescueCase");
const { protect, authorize } = require("../middleware/auth");

// All admin routes require auth + admin role
router.use(protect, authorize("admin"));

// ─── GET /api/admin/dashboard ────────────────────── Analytics overview
router.get("/dashboard", async (req, res, next) => {
  try {
    const [
      totalUsers, totalCases, activeCases, rescuedCases,
      criticalCases, pendingVerification, recentCases
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      RescueCase.countDocuments(),
      RescueCase.countDocuments({ status: { $nin: ["closed", "rejected"] } }),
      RescueCase.countDocuments({ status: "rescued" }),
      RescueCase.countDocuments({ urgencyLevel: "critical", status: { $nin: ["closed", "rejected", "rescued"] } }),
      User.countDocuments({ role: { $in: ["ngo", "volunteer"] }, isVerified: false }),
      RescueCase.find({ status: { $nin: ["closed", "rejected"] } })
        .sort("-createdAt")
        .limit(10)
        .populate("reportedBy", "name")
        .select("caseId animalType urgencyLevel status city createdAt"),
    ]);

    // Cases by status
    const casesByStatus = await RescueCase.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Cases by animal type
    const casesByAnimal = await RescueCase.aggregate([
      { $group: { _id: "$animalType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Cases by city (top 10)
    const hotspots = await RescueCase.aggregate([
      { $match: { city: { $exists: true, $ne: null } } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await RescueCase.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: 1 },
          rescued: { $sum: { $cond: [{ $eq: ["$status", "rescued"] }, 1, 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Average response time (reported → rescued)
    const avgResponseTime = await RescueCase.aggregate([
      { $match: { status: { $in: ["rescued", "closed"] }, rescuedAt: { $exists: true } } },
      {
        $project: {
          responseHours: {
            $divide: [{ $subtract: ["$rescuedAt", "$createdAt"] }, 3600000],
          },
        },
      },
      { $group: { _id: null, avgHours: { $avg: "$responseHours" } } },
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers, totalCases, activeCases, rescuedCases,
          criticalCases, pendingVerification,
          rescueRate: totalCases ? ((rescuedCases / totalCases) * 100).toFixed(1) + "%" : "0%",
          avgResponseHours: avgResponseTime[0]?.avgHours?.toFixed(1) || "N/A",
        },
        casesByStatus,
        casesByAnimal,
        hotspots,
        monthlyTrend,
        recentCases,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/users ─────────────────────────── List all users
router.get("/users", async (req, res, next) => {
  try {
    const { role, isVerified, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";
    if (search) filter.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { organizationName: new RegExp(search, "i") },
    ];

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort("-createdAt")
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .select("-password"),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, total, data: users });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/users/:id/verify ─────────────── Verify NGO/volunteer
router.patch("/users/:id/verify", async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({
      success: true,
      message: `${user.name} has been ${isVerified ? "verified" : "unverified"}.`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/users/:id/deactivate ─────────── Deactivate user
router.patch("/users/:id/deactivate", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, message: `Account ${user.isActive ? "activated" : "deactivated"}.`, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/users/:id/role ──────────────── Change user role
router.patch("/users/:id/role", async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["citizen", "volunteer", "ngo", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    res.json({ success: true, message: `Role updated to ${role}.`, data: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
