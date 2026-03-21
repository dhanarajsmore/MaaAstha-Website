const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Select"],
      required: true,
    },

    address: { type: String, required: true, trim: true },
    mobileNo: { type: String, default: "", trim: true },
    idDocument: { type: String, default: "", trim: true },

    arrivalDateTime: { type: Date, required: true },
    broughtBy: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    condition: { type: String, default: "", trim: true },

    imageUrl: { type: String, default: "" },

    status: { type: String, default: "Sheltered", trim: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Person", personSchema);
