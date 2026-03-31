const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    beforeImageUrl: { type: String, default: "" },
    afterImageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Story", storySchema);
