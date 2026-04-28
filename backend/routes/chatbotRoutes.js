const express = require("express");
const { body } = require("express-validator");
const { chat } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/", [body("message").trim().isLength({ min: 2 }).withMessage("Message is required")], chat);

module.exports = router;
