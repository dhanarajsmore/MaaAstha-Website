const MissingPerson = require("../models/MissingPerson");

const addMissingPerson = async (req, res) => {
  try {
    // 🔥 FIX: missingSince ke sath gender aur description bhi le rahe hain
    const { name, age, missingSince, location, gender, description } = req.body;

    // 🔥 FIX: 6 cases wali limit HATA di gayi hai (Unlimited Cases Now!)

    if (!name || !age || !missingSince || !location) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const imageUrl = req.file ? req.file.path : "";

    const newPerson = await MissingPerson.create({
      name,
      age,
      missingSince,
      location,
      gender, // New UI field
      description, // New UI field
      imageUrl,
    });

    res.status(201).json({ success: true, data: newPerson });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMissingPersons = async (req, res) => {
  try {
    // 🔥 FIX: .limit(6) hata diya
    const persons = await MissingPerson.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: persons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteMissingPerson = async (req, res) => {
  try {
    await MissingPerson.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = { addMissingPerson, getMissingPersons, deleteMissingPerson };
