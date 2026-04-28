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

exports.chat = async (req, res, next) => {
  try {
    ensureValid(req);
    const { message } = req.body;

    const firstAidResp = await axios
      .post(`${AI_BASE_URL}/firstaid/help`, { issue: message }, { timeout: 15000 })
      .then((r) => r.data)
      .catch(() => null);

    const reply =
      (typeof firstAidResp === "string" && firstAidResp) ||
      firstAidResp?.advice ||
      firstAidResp?.response ||
      "Stay calm, keep safe distance from the animal, and contact nearby rescue support.";

    res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
};
