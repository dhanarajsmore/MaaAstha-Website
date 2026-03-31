const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");
const {
  addStory,
  getStories,
  deleteStory,
} = require("../controllers/storyController");

router.get("/all", getStories);

router.post(
  "/add",
  protect,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  addStory,
);

router.delete("/delete/:id", protect, deleteStory);

module.exports = router;
