const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const { auth } = require("../middleware/auth");

// Get user cart
router.get("/user/:userId", async (req, res) => {
  //   if (req.user._id.toString() !== req.params.userId)
  //     return res.status(403).json({ error: "Forbidden" });
  let cart = await Cart.findOne({ userId: req.params.userId }).populate(
    "items.productId"
  );
  if (!cart) cart = new Cart({ userId: req.params.userId, items: [] });
  res.json(cart);
});

// Add/Update item
router.post("/", auth, async (req, res) => {
  try {
    let { productId, quantity, shopId } = req.body;

    // Auto-resolve shopId if missing (Single Shop Mode)
    if (!shopId) {
      const Shop = require("../models/Shop");
      const defaultShop = await Shop.findOne();
      if (defaultShop) {
        shopId = defaultShop._id;
      } else {
        // Fallback or error if no shop exists at all
        return res.status(400).json({ error: "No shop found in system" });
      }
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, shopId, items: [] });
    }

    // If shopId is different, clear cart and start fresh for new shop
    if (cart.shopId && cart.shopId.toString() !== shopId) {
      cart.items = [];
      cart.shopId = shopId;
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    if (cart.items.length === 0) cart.shopId = null; // reset if empty

    await cart.save();
    await cart.populate("items.productId");
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update quantity
router.put("/update", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const itemIndex = cart.items.findIndex(
    (i) => i.productId.toString() === productId
  );
  if (itemIndex > -1) {
    if (quantity <= 0) cart.items.splice(itemIndex, 1);
    else cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");
    res.json(cart);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// Clear cart
router.delete("/clear/:userId", auth, async (req, res) => {
  if (req.user._id.toString() !== req.params.userId)
    return res.status(403).json({ error: "Forbidden" });
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (cart) {
    cart.items = [];
    cart.shopId = null;
    await cart.save();
  }
  res.json({ success: true });
});

module.exports = router;
