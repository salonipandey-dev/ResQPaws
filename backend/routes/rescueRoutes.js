const express = require("express");
const { body, param } = require("express-validator");
const { reportRescue, getRescueById, getUserHistory, getUserSummary } = require("../controllers/rescueController");
const { protect } = require("../middleware/auth");
const { uploadCaseMedia } = require("../config/cloudinary");

const router = express.Router();

router.post(
  "/report",
  protect,
  uploadCaseMedia.single("image"),
  [
    body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
    body("lat").isFloat({ min: -90, max: 90 }).withMessage("Valid latitude is required"),
    body("lng").isFloat({ min: -180, max: 180 }).withMessage("Valid longitude is required"),
    body("animalType")
      .optional()
      .isIn(["dog", "cat", "bird", "cow", "monkey", "reptile", "other"])
      .withMessage("Invalid animal type"),
  ],
  reportRescue
);

router.get("/user/history", protect, getUserHistory);
router.get("/user/summary", protect, getUserSummary);
router.get("/:id", [param("id").isMongoId().withMessage("Invalid rescue case id")], getRescueById);

module.exports = router;
