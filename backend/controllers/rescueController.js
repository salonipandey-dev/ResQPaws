const axios = require("axios");
const path = require("path");
const { validationResult } = require("express-validator");
const RescueCase = require("../models/RescueCase");
const ApiError = require("../utils/apiError");

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const ensureValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
};

exports.reportRescue = async (req, res, next) => {
  try {
    ensureValid(req);

    if (!req.file) throw new ApiError(400, "Image is required");
    if (!req.file.mimetype.startsWith("image/")) {
      throw new ApiError(400, "Only image files are allowed");
    }

    const { description, lat, lng, animalType = "other" } = req.body;

    const [severityResp, duplicateResp, firstAidResp] = await Promise.allSettled([
      axios.post(`${AI_BASE_URL}/severity/predict`, { text: description }, { timeout: 15000 }),
      axios.post(
        `${AI_BASE_URL}/duplicate/check`,
        {
          text: description,
          location: `${lat},${lng}`,
          lat: Number(lat),
          lng: Number(lng),
        },
        { timeout: 15000 }
      ),
      axios.post(`${AI_BASE_URL}/firstaid/help`, { issue: description }, { timeout: 15000 }),
    ]);

    const severity = severityResp.status === "fulfilled" ? severityResp.value.data : null;
    const duplicate = duplicateResp.status === "fulfilled" ? duplicateResp.value.data : null;
    const firstAid = firstAidResp.status === "fulfilled" ? firstAidResp.value.data : null;
    const severityLabel = String(severity?.severity || "").toUpperCase();
    const severityToScore = {
      LOW: 25,
      MEDIUM: 50,
      HIGH: 75,
      CRITICAL: 95,
    };
    const aiScore = Number(severity?.score ?? severity?.severity_score ?? severityToScore[severityLabel] ?? 50);
    const mediaUrl = req.file.path?.startsWith("http")
      ? req.file.path
      : `/uploads/cases/${path.basename(req.file.path || req.file.filename)}`;
    const publicId = req.file.filename || path.basename(req.file.path || "");

    const rescueCase = await RescueCase.create({
      reportedBy: req.user._id,
      animalType,
      description,
      urgencyLevel: aiScore >= 80 ? "critical" : aiScore >= 60 ? "high" : aiScore >= 35 ? "medium" : "low",
      aiSeverityScore: Number.isNaN(aiScore) ? 50 : aiScore,
      isDuplicate: Boolean(duplicate?.is_duplicate ?? duplicate?.duplicate),
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      },
      media: [
        {
          url: mediaUrl,
          publicId,
          type: "image",
        },
      ],
      firstAidGuidance:
        typeof firstAid === "string"
          ? firstAid
          : Array.isArray(firstAid?.steps)
          ? firstAid.steps.join(" ")
          : firstAid?.advice || firstAid?.response || "",
      statusLog: [{ status: "reported", changedBy: req.user._id }],
    });

    res.status(201).json({
      success: true,
      data: rescueCase,
      ai: {
        severity,
        duplicate,
        firstAid,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getRescueById = async (req, res, next) => {
  try {
    const rescueCase = await RescueCase.findById(req.params.id)
      .populate("reportedBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!rescueCase) throw new ApiError(404, "Rescue case not found");

    res.json({ success: true, data: rescueCase });
  } catch (err) {
    next(err);
  }
};

exports.getUserHistory = async (req, res, next) => {
  try {
    const cases = await RescueCase.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    next(err);
  }
};

exports.getUserSummary = async (req, res, next) => {
  try {
    const cases = await RescueCase.find({ reportedBy: req.user._id }).select("status urgencyLevel createdAt");
    const reportsSubmitted = cases.length;
    const casesResolved = cases.filter((item) => ["rescued", "closed"].includes(item.status)).length;
    const casesInProgress = cases.filter((item) => !["rescued", "closed", "rejected"].includes(item.status)).length;

    res.json({
      success: true,
      data: {
        reportsSubmitted,
        casesResolved,
        casesInProgress,
        rewardPointsEarned: req.user.rescuePoints || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
