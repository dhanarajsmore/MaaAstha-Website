const mongoose = require("mongoose");

const RescueRequestSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    condition: { type: String, required: true, trim: true },
    reporterName: { type: String, default: "", trim: true },
    reporterPhone: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    status: { type: String, default: "New", trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RescueRequest", RescueRequestSchema);
