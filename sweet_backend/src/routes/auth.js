const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// signup
router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      const { email, password, phone } = req.body;
      let u = await User.findOne({ email });
      if (u) return res.status(400).json({ error: "User exists" });
      const hash = await bcrypt.hash(password, 10);
      u = new User({ email, password: hash, phone });
      await u.save();
      const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        user: { email: u.email, id: u._id, phone: u.phone, role: u.role },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// login
router.post("/login", body("email").isEmail(), async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      user: {
        email: u.email,
        id: u._id,
        phone: u.phone,
        role: u.role,
        image: u.image,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// TODO: Add /otp route for phone OTP if needed

module.exports = router;
