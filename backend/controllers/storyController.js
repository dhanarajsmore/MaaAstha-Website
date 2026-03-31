const Story = require("../models/Story");
const { cloudinary } = require("../config/cloudinary");

const addStory = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Title and Description are required",
        });
    }

    const beforeImageUrl =
      req.files && req.files["beforeImage"]
        ? req.files["beforeImage"][0].path
        : "";
    const afterImageUrl =
      req.files && req.files["afterImage"]
        ? req.files["afterImage"][0].path
        : "";

    const newStory = await Story.create({
      title,
      description,
      location,
      beforeImageUrl,
      afterImageUrl,
    });

    res.status(201).json({ success: true, data: newStory });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error while saving story" });
  }
};

const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    const deleteFromCloudinary = async (imageUrl) => {
      if (imageUrl && imageUrl.includes("cloudinary")) {
        const urlParts = imageUrl.split("/");
        const filename = urlParts[urlParts.length - 1];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
    };

    await deleteFromCloudinary(story.beforeImageUrl);
    await deleteFromCloudinary(story.afterImageUrl);

    await Story.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Story and images deleted securely" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = { addStory, getStories, deleteStory };
