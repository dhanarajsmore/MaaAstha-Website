const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    idType: { type: String, required: true }, // e.g., Aadhar, PAN, Voter ID
    idNumber: { type: String, required: true },
    profession: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    helpText: { type: String, required: true },
    availability: { type: String, required: true },
    status: { type: String, default: "Pending" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);