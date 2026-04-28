const express = require("express");
const { body } = require("express-validator");
const { listRewards, claimReward } = require("../controllers/rewardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, listRewards);
router.post(
  "/claim",
  protect,
  [
    body("points").isInt({ min: 1 }).withMessage("Points must be at least 1"),
    body("reason").optional().isString().isLength({ min: 3 }).withMessage("Valid reason is required"),
  ],
  claimReward
);

module.exports = router;
