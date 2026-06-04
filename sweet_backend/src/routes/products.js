const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { auth, adminOnly } = require("../middleware/auth");

// public get all (with optional shop filter)
router.get("/", async (req, res) => {
  const { shopId } = req.query;
  let filter = {};
  if (shopId) filter.shop = shopId;
  const products = await Product.find(filter).lean();
  res.json(products);
});

// get all for a specific shop
router.get("/shop/:shopId", async (req, res) => {
  const products = await Product.find({ shop: req.params.shopId }).lean();
  res.json(products);
});

// get one
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("shop", "name location");
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

// admin create (linked to shop)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) return res.status(400).json({ error: "shopId is required" });

    const p = new Product({
      ...req.body,
      shop: shopId
    });
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// admin update
router.patch("/:id", auth, adminOnly, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// admin delete
router.delete("/:id", auth, adminOnly, async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});

module.exports = router;
