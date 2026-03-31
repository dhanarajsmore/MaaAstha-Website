const Donation = require("../models/Donation");

const addDonation = async (req, res) => {
  try {
    const { name, phone, amount, modeOfPayment, transactionId } = req.body;

    if (!name || !phone || !amount || !modeOfPayment || !transactionId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newDonation = await Donation.create({
      name,
      phone,
      amount,
      modeOfPayment,
      transactionId,
    });

    res.status(201).json({ success: true, data: newDonation });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction ID already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    res.status(200).json({ success: true, data: updatedDonation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

const deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = {
  addDonation,
  getDonations,
  updateDonationStatus,
  deleteDonation,
};
