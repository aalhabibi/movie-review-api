const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  registerationValidator,
  loginValidator,
} = require("../middleware/authMiddleWare");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerationValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  await registerUser(username, email, password);
  res.status(201).json({ message: "User registered successfully!" });
});

router.post("/login", loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  await loginUser(email, password, res);
});

module.exports = router;
