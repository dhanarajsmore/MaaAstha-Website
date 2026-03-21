const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    helpText: { type: String, required: true, trim: true },
    status: { type: String, default: "New", trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Volunteer", VolunteerSchema);
