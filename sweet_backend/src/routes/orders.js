const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { auth, adminOnly } = require("../middleware/auth");
const { checkWithinRadius } = require("../utils/distance");

// create order (customer)
router.post("/", auth, async (req, res) => {
  try {
    const { location, items, total, address, paymentId, paymentStatus } = req.body;

    // Validate required fields
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({ error: "Customer location is required" });
    }

    if (!address) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    // Get shop location from environment
    const shopLocation = {
      lat: parseFloat(process.env.SHOP_LAT),
      lng: parseFloat(process.env.SHOP_LNG),
    };

    const maxRadius = parseInt(process.env.DELIVERY_RADIUS_KM) || 10;

    // Check distance
    const distanceCheck = checkWithinRadius(shopLocation, location, maxRadius);

    if (!distanceCheck.isWithinRange) {
      return res.status(400).json({
        error: `Sorry, you are outside our delivery area. We deliver within ${maxRadius}km radius.`,
        distance: distanceCheck.distance,
        maxRadius: maxRadius,
      });
    }

    const order = new Order({
      user: req.user._id,
      items: items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      })),
      totalAmount: total,
      deliveryAddress: {
        address: address,
        lat: location.lat,
        lng: location.lng,
      },
      distanceFromShop: distanceCheck.distance,
      status: "pending",
      paymentId: paymentId,
      paymentStatus: paymentStatus || "pending",
    });

    await order.save();

    // Populate user details for response
    await order.populate("user", "name email phone");

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get orders (for admin/shop owner)
router.get("/admin/all", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// get orders (for admin/shop owner) - OLD (keep for compatibility if needed)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { shopId } = req.query;
    let filter = {};
    if (shopId) filter.shop = shopId;

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("shop", "name")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get user orders
router.get("/user/:userId", auth, async (req, res) => {
  if (
    req.user._id.toString() !== req.params.userId &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const orders = await Order.find({ user: req.params.userId })
    .populate("shop", "name image")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .lean();
  res.json(orders);
});

// update status (shop owner/admin)
router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "email phone");

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
