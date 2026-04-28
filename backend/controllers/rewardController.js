const Reward = require("../models/Reward");
const User = require("../models/User");
const ApiError = require("../utils/apiError");

exports.listRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: rewards.length, data: rewards });
  } catch (err) {
    next(err);
  }
};

exports.claimReward = async (req, res, next) => {
  try {
    const { points = 0, reason = "case_reported" } = req.body;
    if (Number(points) <= 0) throw new ApiError(400, "Points must be greater than 0");

    const reward = await Reward.create({
      user: req.user._id,
      type: "points",
      points: Number(points),
      reason,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { rescuePoints: Number(points) } });

    res.status(201).json({ success: true, data: reward });
  } catch (err) {
    next(err);
  }
};
