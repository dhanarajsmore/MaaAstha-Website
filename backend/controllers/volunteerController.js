const Volunteer = require("../models/Volunteer");

const addVolunteer = async (req, res) => {
  try {
    const { name, gender, age, idType, idNumber, profession, phone, email, address, helpText, availability } = req.body;

    // Check if all required fields exist
    if (!name || !gender || !age || !idType || !idNumber || !profession || !phone || !email || !address || !helpText || !availability) {
      return res.status(400).json({ success: false, message: "Please fill out all the fields before submitting." });
    }

    const newVolunteer = await Volunteer.create(req.body);
    res.status(201).json({ success: true, data: newVolunteer });
  } catch (error) {
    console.error("Volunteer Add Error:", error);
    // If Mongoose throws a validation error, send it nicely to frontend
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error while submitting application" });
  }
};

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateVolunteerStatus = async (req, res) => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true } // Mongoose requires 'new' instead of 'returnDocument'
    );
    res.status(200).json({ success: true, data: updatedVolunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = {
  addVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
};