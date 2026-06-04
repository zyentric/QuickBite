const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../middleware/upload");
const { auth } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");

// GET user profile (after login)
router.get("/me", auth, async (req, res) => {
  console.log("User:", req.body);

  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE

router.put("/me", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updateData = { name, phone, address };

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "users" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Image upload failed" });
          }
          updateData.image = result.secure_url;

          const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
          ).select("-password");

          res.json(updatedUser);
        }
      );

      result.end(req.file.buffer);
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true }
      ).select("-password");
      res.json(updatedUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});
module.exports = router;
