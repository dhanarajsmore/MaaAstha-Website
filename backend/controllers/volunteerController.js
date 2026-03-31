const Volunteer = require("../models/Volunteer");

const addVolunteer = async (req, res) => {
  try {
    const { name, gender, age, idType, idNumber, profession, phone, email, address, helpText, availability } = req.body;

    if (!name || !phone || !email || !idNumber) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    const newVolunteer = await Volunteer.create(req.body);
    res.status(201).json({ success: true, data: newVolunteer });
  } catch (error) {
    console.error("Volunteer Add Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
      { new: true }
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

module.exports = { addVolunteer, getVolunteers, updateVolunteerStatus, deleteVolunteer };