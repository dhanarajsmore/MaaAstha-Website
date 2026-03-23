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
    const { name, phone, email, amount, paymentMode, referenceId, message, status } = req.body;
    if (!name || !amount || amount < 1) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
    const donation = await Donation.create({
      name, phone, email, amount, paymentMode, referenceId, message, status: status || "Pending",
    });
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const updated = await Donation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

const deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = { getDonations, addDonation, updateDonationStatus, deleteDonation };