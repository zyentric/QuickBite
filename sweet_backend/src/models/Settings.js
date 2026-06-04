const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    shopLat: { type: Number, default: 28.6139 },
    shopLng: { type: Number, default: 77.209 },
    radius: { type: Number, default: 15 },
    openingHours: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
