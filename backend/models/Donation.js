const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    modeOfPayment: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", donationSchema);
