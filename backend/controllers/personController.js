const Person = require("../models/Person");

// 1. Add Person logic
const addPerson = async (req, res) => {
  try {
    const { fullName, age, gender, address, arrivalDateTime, broughtBy, reason } = req.body;
    if (!fullName || !age || !gender || !address || !arrivalDateTime || !broughtBy || !reason) {
      return res.status(400).json({ success: false, message: "Please fill all required fields!" });
    }
    const personData = { ...req.body };
    if (req.file) {
      personData.imageUrl = req.file.path;
      personData.image = req.file.path;
    }
    const newPerson = new Person(personData);
    await newPerson.save();
    res.status(201).json({ success: true, message: "Record saved successfully!", data: newPerson });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. Get All logic
const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: persons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. Update Status logic
const updatePersonStatus = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json({ success: true, data: updatedPerson });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// 4. Delete logic
const deletePerson = async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// 5. Dashboard Stats logic (UPDATED with Self Exited)
const getDashboardStats = async (req, res) => {
  try {
    const totalSheltered = await Person.countDocuments({ status: "Sheltered" });
    const reunited = await Person.countDocuments({ status: "Reunited" });
    const escaped = await Person.countDocuments({ status: "Escaped" });
    const dead = await Person.countDocuments({ status: "Dead" });
    const selfExited = await Person.countDocuments({ status: "Self Exited" });

    res.status(200).json({
      success: true,
      data: { totalSheltered, reunited, escaped, dead, selfExited },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Could not fetch stats" });
  }
};

module.exports = {
  addPerson,
  getAllPersons,
  updatePersonStatus,
  deletePerson,
  getDashboardStats,
};