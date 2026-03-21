const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    amount: { type: Number, required: true, min: 1 },
    paymentMode: { type: String, default: "UPI", trim: true },
    referenceId: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", DonationSchema);
