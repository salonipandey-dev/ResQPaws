const express = require("express");
const { body } = require("express-validator");
const { register, login, me, updateMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["user", "ngo", "admin"]).withMessage("Role must be user, ngo, or admin"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
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
