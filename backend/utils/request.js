const { validationResult } = require("express-validator");

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }

  res.status(400).json({ success: false, errors: errors.array() });
  return true;
};

const parsePositiveInt = (value, defaultValue, { min = 1, max = 100 } = {}) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  if (parsed < min) {
    return min;
  }

  if (parsed > max) {
    return max;
  }

  return parsed;
};

const parseJsonArray = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw createHttpError(400, `${fieldName} must be an array.`);
  }

  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw createHttpError(400, `${fieldName} must be valid JSON array.`);
  }

  if (!Array.isArray(parsed)) {
    throw createHttpError(400, `${fieldName} must be an array.`);
  }

  return parsed;
};

module.exports = {
  createHttpError,
  sendValidationErrors,
  parsePositiveInt,
  parseJsonArray,
};
