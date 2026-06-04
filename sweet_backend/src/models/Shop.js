const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    address: { type: String, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    radius: { type: Number, default: 5 }, // Delivery radius in km
    openingHours: { type: String },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ShopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Shop", ShopSchema);
