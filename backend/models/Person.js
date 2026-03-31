const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, trim: true, sparse: true }, // Naya Unique ID field
    name: { type: String, trim: true },
    fullName: { type: String, trim: true },
    age: { type: Number, min: 0 },
    gender: { type: String },
    location: { type: String, trim: true },
    address: { type: String, trim: true },
    identificationMarks: { type: String, default: "", trim: true },
    clothing: { type: String, default: "", trim: true },
    description: { type: String, trim: true },
    status: { type: String, default: "Sheltered", trim: true },
    imageUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    mobileNo: { type: String },
    idDocument: { type: String },
    arrivalDateTime: { type: Date },
    broughtBy: { type: String },
    reason: { type: String },
    condition: { type: String }
  },
  { timestamps: true, strict: false } 
);

module.exports = mongoose.model("Person", PersonSchema);