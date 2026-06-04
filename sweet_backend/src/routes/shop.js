const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const geolib = require("geolib");

// Middleware to check if user is authenticated (simplified for now, assume req.userId is set by auth middleware)
// In a real app, you'd use a proper auth middleware
// For now, we'll assume the auth middleware is applied in app.js and sets req.user

// REGISTER SHOP
router.post(
    "/register",
    body("name").notEmpty(),
    body("address").notEmpty(),
    body("lat").isFloat(),
    body("lng").isFloat(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            // Assuming req.userId is available from auth middleware
            // For MVP without strict auth middleware on this route yet, we might need to pass userId in body, 
            // but let's assume standard auth header usage.
            // If req.user is not set, this will fail. We need to make sure auth middleware is used.

            // TEMPORARY: If we don't have auth middleware yet, let's accept userId in body for testing.
            // Ideally: const userId = req.user.id;
            const { name, description, address, lat, lng, userId, image } = req.body;

            if (!userId) return res.status(401).json({ error: "User ID required" });

            const existingShop = await Shop.findOne({ owner: userId });
            if (existingShop) return res.status(400).json({ error: "User already owns a shop" });

            const shop = new Shop({
                owner: userId,
                name,
                description,
                address,
                image,
                location: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
            });

            await shop.save();

            // Update User Role to ShopOwner (or ensure they have permissions)
            await User.findByIdAndUpdate(userId, { role: "admin" }); // Using 'admin' as shop owner based on existing User model enum

            res.status(201).json({ shop });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    }
);

// GET SHOP LOCATION (Single Shop Configuration)
router.get("/location", async (req, res) => {
    try {
        const shopInfo = {
            name: process.env.SHOP_NAME || "Sweet Shop",
            lat: parseFloat(process.env.SHOP_LAT),
            lng: parseFloat(process.env.SHOP_LNG),
            address: process.env.SHOP_ADDRESS,
            deliveryRadius: parseInt(process.env.DELIVERY_RADIUS_KM) || 10,
        };
        res.json(shopInfo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch shop location" });
    }
});

// GET ALL SHOPS (with optional geo-filter)
router.get("/", async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (lat && lng) {
            const maxDist = (radius || 10) * 1000; // km to meters
            const shops = await Shop.find({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                        $maxDistance: maxDist,
                    },
                },
            });
            return res.json(shops);
        }

        const shops = await Shop.find().sort({ createdAt: -1 });
        res.json(shops);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// GET SHOP DETAILS
router.get("/:id", async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) return res.status(404).json({ error: "Shop not found" });
        res.json(shop);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// GET SHOP BY OWNER (for dashboard)
router.get("/owner/:userId", async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.params.userId });
        if (!shop) return res.status(404).json({ error: "Shop not found" });
        res.json(shop);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// GLOBAL SEARCH (Products only)
router.get("/global/search", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ products: [] });

        const regex = new RegExp(q, "i");

        const products = await require("../models/Product").find({
            $or: [{ name: regex }, { description: regex }, { category: regex }]
        }).limit(20);

        res.json({ products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
});

// UPDATE SHOP
router.patch("/:id", async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!shop) return res.status(404).json({ error: "Shop not found" });
        res.json(shop);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
