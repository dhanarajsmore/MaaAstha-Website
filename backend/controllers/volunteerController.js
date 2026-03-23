const Volunteer = require("../models/Volunteer");

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addVolunteer = async (req, res) => {
  try {
    const { name, phone, helpText } = req.body;
    if (!name || !phone || !helpText) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const volunteer = await Volunteer.create({ name, phone, helpText });
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateVolunteerStatus = async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = { getVolunteers, addVolunteer, updateVolunteerStatus, deleteVolunteer };