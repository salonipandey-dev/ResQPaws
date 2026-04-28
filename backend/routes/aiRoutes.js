const express = require("express");
const { body } = require("express-validator");
const { predictSeverity, checkDuplicate, firstAid } = require("../controllers/aiController");

const router = express.Router();

router.post("/severity", [body("text").trim().notEmpty().withMessage("text is required")], predictSeverity);
router.post(
  "/duplicate",
  [
    body("text").trim().notEmpty().withMessage("text is required"),
    body("lat").isFloat({ min: -90, max: 90 }).withMessage("valid lat is required"),
    body("lng").isFloat({ min: -180, max: 180 }).withMessage("valid lng is required"),
    body("location").optional().isString(),
  ],
  checkDuplicate
);
router.post("/firstaid", [body("issue").trim().notEmpty().withMessage("issue is required")], firstAid);

module.exports = router;
