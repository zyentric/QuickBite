const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", async (req, res) => {
  let s = await Settings.findOne();
  if (!s) {
    s = new Settings();
    await s.save();
  }
  res.json(s);
});

router.post("/", auth, adminOnly, async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = new Settings();
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
});

module.exports = router;
