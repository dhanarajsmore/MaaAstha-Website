const Donation = require("../models/Donation");

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addDonation = async (req, res) => {
  try {
    const { name, phone, email, amount, paymentMode, referenceId, message } =
      req.body;

    if (!name || !amount || amount < 1) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const donation = await Donation.create({
      name,
      phone,
      email,
      amount,
      paymentMode,
      referenceId,
      message,
    });

    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getDonations, addDonation };
