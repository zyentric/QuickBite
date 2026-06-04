// backend/routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

// Initialize Razorpay instance
const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

console.log("Razorpay Key Loaded:", !!process.env.RAZORPAY_KEY);
console.log("Razorpay Secret Loaded:", !!process.env.RAZORPAY_SECRET);

// =====================
// Create Razorpay Order
// =====================
router.post("/create", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const options = {
      amount: parseInt(amount), // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await rzp.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay Order Creation Error:", err);
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});

// =====================
// Razorpay Webhook Template
// =====================
router.post("/webhook", express.json({ type: "*/*" }), (req, res) => {
  const secret = process.env.RAZORPAY_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === signature) {
    console.log("Webhook verified:", req.body);
    // TODO: Update your order status in DB
    res.json({ ok: true });
  } else {
    console.warn("Invalid Razorpay webhook signature");
    res.status(400).json({ error: "Invalid signature" });
  }
});

module.exports = router;
