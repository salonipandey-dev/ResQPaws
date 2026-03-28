const User = require("../models/User");
const Reward = require("../models/Reward");

// Points awarded for each action
const POINTS = {
  case_reported: 10,
  case_verified: 25,
  case_rescued: 50,
  first_rescue: 100,
  "10_reports": 75,
  daily_login: 5,
  profile_complete: 20,
  fake_report_penalty: -30,
};

// Badges definition
const BADGES = {
  first_rescue: { name: "First Responder", icon: "🐾", description: "Reported your first rescue case" },
  "10_reports": { name: "Rescue Hero", icon: "🦸", description: "Submitted 10 rescue reports" },
  "50_reports": { name: "Animal Guardian", icon: "🛡️", description: "Submitted 50 rescue reports" },
  top_rescuer: { name: "Top Rescuer", icon: "🏆", description: "Ranked in the top 10 rescuers" },
  profile_complete: { name: "Profile Star", icon: "⭐", description: "Completed your profile" },
};

// Award points and optionally a badge to a user
const awardPoints = async (userId, reason, caseId = null) => {
  const points = POINTS[reason] || 0;
  if (points === 0) return;

  await User.findByIdAndUpdate(userId, {
    $inc: { rescuePoints: points },
  });

  await Reward.create({
    user: userId,
    type: "points",
    points,
    reason,
    relatedCase: caseId,
  });
};

// Award a badge if the user doesn't already have it
const awardBadge = async (userId, badgeKey) => {
  const badge = BADGES[badgeKey];
  if (!badge) return;

  const user = await User.findById(userId);
  const alreadyHas = user.badges.some((b) => b.name === badge.name);
  if (alreadyHas) return;

  user.badges.push({ name: badge.name, icon: badge.icon });
  await user.save();

  await Reward.create({
    user: userId,
    type: "badge",
    badge,
    reason: badgeKey,
  });
};

// Called after a case is reported — check milestones
const handleCaseReported = async (userId, caseId) => {
  await User.findByIdAndUpdate(userId, { $inc: { totalReports: 1 } });
  await awardPoints(userId, "case_reported", caseId);

  const user = await User.findById(userId);

  if (user.totalReports === 1) {
    await awardBadge(userId, "first_rescue");
    await awardPoints(userId, "first_rescue", caseId);
  }
  if (user.totalReports === 10) {
    await awardBadge(userId, "10_reports");
    await awardPoints(userId, "10_reports", caseId);
  }
  if (user.totalReports === 50) {
    await awardBadge(userId, "50_reports");
  }
};

// Called when a case is rescued
const handleCaseRescued = async (reporterId, responderId, caseId) => {
  await User.findByIdAndUpdate(reporterId, { $inc: { verifiedReports: 1 } });
  await awardPoints(reporterId, "case_verified", caseId);

  if (responderId) {
    await User.findByIdAndUpdate(responderId, { $inc: { totalRescues: 1 } });
    await awardPoints(responderId, "case_rescued", caseId);
  }
};

// Penalize for fake reports
const penalizeFakeReport = async (userId, caseId) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { rescuePoints: POINTS.fake_report_penalty, trustScore: -10 },
  });
  await Reward.create({
    user: userId,
    type: "trust_decrease",
    points: POINTS.fake_report_penalty,
    reason: "fake_report_penalty",
    relatedCase: caseId,
  });
};

module.exports = { awardPoints, awardBadge, handleCaseReported, handleCaseRescued, penalizeFakeReport };
