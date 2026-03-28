const express = require("express");
const router = express.Router();
const { body, query, validationResult } = require("express-validator");
const RescueCase = require("../models/RescueCase");
const { protect, authorize, requireVerified } = require("../middleware/auth");
const { uploadCaseMedia } = require("../config/cloudinary");
const { handleCaseReported, handleCaseRescued, penalizeFakeReport } = require("../utils/gamification");

// Valid status transitions
const STATUS_TRANSITIONS = {
  reported: ["verified", "rejected"],
  verified: ["accepted", "rejected"],
  accepted: ["on_the_way"],
  on_the_way: ["rescued"],
  rescued: ["closed"],
  closed: [],
  rejected: [],
};

// ─── POST /api/cases ───────────────────────────────
router.post(
  "/",
  protect,
  uploadCaseMedia.array("media", 5),
  [
    body("animalType").isIn(["dog", "cat", "bird", "cow", "monkey", "reptile", "other"]),
    body("description").trim().isLength({ min: 10, max: 1000 }),
    body("urgencyLevel").optional().isIn(["low", "medium", "high", "critical"]),
    body("latitude").isFloat({ min: -90, max: 90 }),
    body("longitude").isFloat({ min: -180, max: 180 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const {
        animalType,
        animalCount,
        description,
        urgencyLevel,
        conditionTags,
        latitude,
        longitude,
        address,
        landmark,
        city,
        state,
        contactPhone,
        originalLanguage,
      } = req.body;

      const media = (req.files || []).map((file) => ({
        url: file.path,
        publicId: file.filename,
        type: file.mimetype.startsWith("video") ? "video" : "image",
      }));

      const rescueCase = await RescueCase.create({
        reportedBy: req.user._id,
        contactPhone: contactPhone || req.user.phone,
        animalType,
        animalCount: animalCount || 1,
        description,
        urgencyLevel: urgencyLevel || "medium",
        conditionTags: conditionTags ? JSON.parse(conditionTags) : [],
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        address,
        landmark,
        city,
        state,
        media,
        originalLanguage: originalLanguage || "en",
        statusLog: [
          {
            status: "reported",
            changedBy: req.user._id,
            note: "Case reported",
          },
        ],
      });

      await handleCaseReported(req.user._id, rescueCase._id);

      res.status(201).json({
        success: true,
        message: `Case ${rescueCase.caseId} reported successfully.`,
        data: rescueCase,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/cases ────────────────────────────────
router.get("/", protect, async (req, res, next) => {
  try {
    const {
      status,
      urgencyLevel,
      animalType,
      city,
      assignedTo,
      lat,
      lng,
      radius,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const filter = {};

    if (req.user.role === "citizen") {
      filter.reportedBy = req.user._id;
    } else if (req.user.role === "volunteer") {
      filter.$or = [
        { assignedTo: req.user._id },
        { status: { $in: ["verified", "accepted"] } },
      ];
    }

    if (status) filter.status = status;
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;
    if (animalType) filter.animalType = animalType;
    if (city) filter.city = new RegExp(city, "i");
    if (assignedTo) filter.assignedTo = assignedTo;

    if (lat && lng && radius) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000,
        },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [cases, total] = await Promise.all([
      RescueCase.find(filter)
        .populate("reportedBy", "name avatar role trustScore")
        .populate("assignedTo", "name avatar role organizationName")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      RescueCase.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: cases,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/cases/nearby ───────────────────────── Cases near a coordinate
router.get("/nearby", protect, async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "lat and lng required" });
    }

    const cases = await RescueCase.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000,
        },
      },
      status: { $nin: ["closed", "rejected"] },
    })
      .populate("reportedBy", "name email avatar")
      .populate("reportedBy", "name avatar")
      .limit(50);

    res.json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/cases/:id ─────────────────────────── Get single case
router.get("/:id", protect, async (req, res, next) => {
  try {
    const rescueCase = await RescueCase.findById(req.params.id)
      .populate("reportedBy", "name avatar phone role trustScore")
      .populate("assignedTo", "name avatar phone role organizationName")
      .populate("assignedTeam", "name avatar role")
      .populate("statusLog.changedBy", "name role");

    if (!rescueCase) {
      return res.status(404).json({ success: false, message: "Case not found." });
    }

    res.json({ success: true, data: rescueCase });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  protect,
  [
    body("animalType").optional().isIn(["dog", "cat", "bird", "cow", "monkey", "reptile", "other"]),
    body("description").optional().trim().isLength({ min: 10, max: 1000 }),
    body("urgencyLevel").optional().isIn(["low", "medium", "high", "critical"]),
    body("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("Valid latitude required"),
    body("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("Valid longitude required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const rescueCase = await RescueCase.findById(req.params.id);
      if (!rescueCase) {
        return res.status(404).json({ success: false, message: "Case not found." });
      }

      const isOwner = rescueCase.reportedBy.toString() === req.user._id.toString();
      const isPrivileged = ["ngo", "admin"].includes(req.user.role);
      if (!isOwner && !isPrivileged) {
        return res.status(403).json({ success: false, message: "Not authorized to update this case." });
      }

      if (!["reported", "verified"].includes(rescueCase.status) && req.user.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "Case details can only be edited while status is reported/verified.",
        });
      }

      const allowed = [
        "animalType",
        "animalCount",
        "description",
        "urgencyLevel",
        "address",
        "landmark",
        "city",
        "state",
        "contactPhone",
        "originalLanguage",
      ];

      for (const field of allowed) {
        if (req.body[field] !== undefined) {
          rescueCase[field] = req.body[field];
        }
      }

      if (req.body.latitude !== undefined || req.body.longitude !== undefined) {
        const lat = req.body.latitude !== undefined
          ? parseFloat(req.body.latitude)
          : rescueCase.location.coordinates[1];
        const lng = req.body.longitude !== undefined
          ? parseFloat(req.body.longitude)
          : rescueCase.location.coordinates[0];

        rescueCase.location = { type: "Point", coordinates: [lng, lat] };
      }

      if (req.body.conditionTags !== undefined) {
        rescueCase.conditionTags = Array.isArray(req.body.conditionTags)
          ? req.body.conditionTags
          : JSON.parse(req.body.conditionTags);
      }

      rescueCase.statusLog.push({
        status: rescueCase.status,
        changedBy: req.user._id,
        note: "Case details updated",
      });

      await rescueCase.save();
      res.json({ success: true, message: "Case updated successfully.", data: rescueCase });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PATCH /api/cases/:id/status ─────────────────── Update case status
router.patch(
  "/:id/status",
  protect,
  authorize("ngo", "volunteer", "admin"),
  requireVerified,
  async (req, res, next) => {
    try {
      const { status, note, assignTo } = req.body;

      const rescueCase = await RescueCase.findById(req.params.id);
      if (!rescueCase) {
        return res.status(404).json({ success: false, message: "Case not found." });
      }

      // Validate transition
      const allowed = STATUS_TRANSITIONS[rescueCase.status] || [];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition from '${rescueCase.status}' to '${status}'.`,
          allowedTransitions: allowed,
        });
      }

      rescueCase.status = status;
      rescueCase.statusLog.push({ status, changedBy: req.user._id, note });

      // Auto-set timestamps and assign
      if (status === "accepted") {
        rescueCase.assignedTo = assignTo || req.user._id;
      }
      if (status === "rescued") {
        rescueCase.rescuedAt = new Date();
        await handleCaseRescued(rescueCase.reportedBy, rescueCase.assignedTo, rescueCase._id);
      }
      if (status === "closed") {
        rescueCase.closedAt = new Date();
        if (req.body.resolutionNote) rescueCase.resolutionNote = req.body.resolutionNote;
      }
      if (status === "rejected" && req.body.isFakeReport) {
        await penalizeFakeReport(rescueCase.reportedBy, rescueCase._id);
      }

      await rescueCase.save();
      res.json({ success: true, message: `Case updated to '${status}'.`, data: rescueCase });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/cases/:id/media ───────────────────── Add media to existing case
router.post(
  "/:id/media",
  protect,
  uploadCaseMedia.array("media", 5),
  async (req, res, next) => {
    try {
      const rescueCase = await RescueCase.findById(req.params.id);
      if (!rescueCase) {
        return res.status(404).json({ success: false, message: "Case not found." });
      }

      // Only reporter, assigned responder, or admin can add media
      const isOwner = rescueCase.reportedBy.toString() === req.user._id.toString();
      const isAssigned = rescueCase.assignedTo?.toString() === req.user._id.toString();
      if (!isOwner && !isAssigned && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }

      const newMedia = (req.files || []).map((f) => ({
        url: f.path,
        publicId: f.filename,
        type: f.mimetype.startsWith("video") ? "video" : "image",
      }));

      rescueCase.media.push(...newMedia);
      await rescueCase.save();

      res.json({ success: true, message: "Media added.", data: rescueCase.media });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/cases/:id/feedback ────────────────── Reporter feedback after rescue
router.post("/:id/feedback", protect, async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const rescueCase = await RescueCase.findById(req.params.id);

    if (!rescueCase) return res.status(404).json({ success: false, message: "Case not found." });
    if (rescueCase.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the reporter can give feedback." });
    }
    if (!["rescued", "closed"].includes(rescueCase.status)) {
      return res.status(400).json({ success: false, message: "Feedback only allowed after rescue." });
    }

    rescueCase.reporterRating = rating;
    rescueCase.reporterFeedback = feedback;
    await rescueCase.save();

    res.json({ success: true, message: "Feedback submitted. Thank you!" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    const rescueCase = await RescueCase.findById(req.params.id);

    if (!rescueCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found."
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = rescueCase.reportedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this case."
      });
    }

    if (!isAdmin && rescueCase.status !== "reported") {
      return res.status(400).json({
        success: false,
        message: "You can only delete your case while it is in 'reported' status."
      });
    }

    await rescueCase.deleteOne();

    res.json({
      success: true,
      message: "Case deleted successfully."
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
