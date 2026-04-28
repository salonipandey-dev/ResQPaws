const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT and attach user to request
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: "Account not found or deactivated." });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token invalid or expired." });
  }
};

// Role-based access control
// Usage: authorize("admin", "ngo")
const authorize = (...roles) => {
  return (req, res, next) => {
    const normalizedRole = req.user.role === "citizen" ? "user" : req.user.role;
    if (!roles.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(", ")}.`,
      });
    }
    next();
  };
};

// Ensure NGO/volunteer is verified by admin before certain actions
const requireVerified = (req, res, next) => {
  if (["ngo", "volunteer"].includes(req.user.role) && !req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Your account is pending admin verification.",
    });
  }
  next();
};

module.exports = { protect, authorize, requireVerified };
