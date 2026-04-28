const axios = require("axios");
const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const ensureValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
};

exports.predictSeverity = async (req, res, next) => {
  try {
    ensureValid(req);
    const response = await axios.post(`${AI_BASE_URL}/severity/predict`, { text: req.body.text }, { timeout: 15000 });
    res.json({ success: true, data: response.data });
  } catch (err) {
    next(new ApiError(502, err.response?.data?.detail || "AI severity service unavailable"));
  }
};

exports.checkDuplicate = async (req, res, next) => {
  try {
    ensureValid(req);
    const payload = {
      text: req.body.text,
      location: req.body.location || `${req.body.lat},${req.body.lng}`,
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
    };
    const response = await axios.post(`${AI_BASE_URL}/duplicate/check`, payload, { timeout: 15000 });
    res.json({ success: true, data: response.data });
  } catch (err) {
    next(new ApiError(502, err.response?.data?.detail || "AI duplicate service unavailable"));
  }
};

exports.firstAid = async (req, res, next) => {
  try {
    ensureValid(req);
    const response = await axios.post(`${AI_BASE_URL}/firstaid/help`, { issue: req.body.issue }, { timeout: 15000 });
    res.json({ success: true, data: response.data });
  } catch (err) {
    next(new ApiError(502, err.response?.data?.detail || "AI first-aid service unavailable"));
  }
};
