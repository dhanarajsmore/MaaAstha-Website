const MissingPerson = require("../models/MissingPerson");
const { cloudinary } = require("../config/cloudinary");

const addMissingPerson = async (req, res) => {
  try {
    const { name, age, missingSince, location, gender, description } = req.body;

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
      gender,
      description,
      imageUrl,
    });

    res.status(201).json({ success: true, data: newPerson });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMissingPersons = async (req, res) => {
  try {
    const persons = await MissingPerson.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: persons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteMissingPerson = async (req, res) => {
  try {
    const person = await MissingPerson.findById(req.params.id);
    if (!person) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    if (person.imageUrl && person.imageUrl.includes("cloudinary")) {
      const urlParts = person.imageUrl.split("/");
      const filename = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const publicId = `${folder}/${filename.split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await MissingPerson.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({
        success: true,
        message: "Deleted successfully from Cloud and DB",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = { addMissingPerson, getMissingPersons, deleteMissingPerson };
