const express = require("express");
const { body } = require("express-validator");
const { register, login, adminLogin, me, updateMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

const strongPassword = body("password")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
  .matches(/[0-9]/).withMessage("Password must contain a number")
  .matches(/[^A-Za-z0-9]/).withMessage("Password must contain a symbol");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    strongPassword,
    body("role").optional().isIn(["user", "ngo"]).withMessage("Role must be user or ngo"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post(
  "/admin-login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminLogin
);

router.get("/me", protect, me);
router.put(
  "/me",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("phone").optional().isString().isLength({ min: 8, max: 15 }).withMessage("Phone must be 8-15 characters"),
    body("city").optional().isString().isLength({ min: 2, max: 100 }).withMessage("City must be 2-100 characters"),
    body("state").optional().isString().isLength({ min: 2, max: 100 }).withMessage("State must be 2-100 characters"),
    body("bio").optional().isString().isLength({ max: 300 }).withMessage("Bio cannot exceed 300 characters"),
  ],
  updateMe
);

module.exports = router;