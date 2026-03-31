const Person = require("../models/Person");
const RescueRequest = require("../models/RescueRequest");
const { cloudinary } = require("../config/cloudinary");

const addPerson = async (req, res) => {
  try {
    const {
      uid,
      fullName,
      age,
      gender,
      address,
      arrivalDateTime,
      broughtBy,
      reason,
    } = req.body;

    if (
      !fullName ||
      !age ||
      !gender ||
      !address ||
      !arrivalDateTime ||
      !broughtBy ||
      !reason
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields!" });
    }

    if (uid) {
      const existingPerson = await Person.findOne({ uid });
      if (existingPerson) {
        return res.status(400).json({
          success: false,
          message: "This Unique ID (UID) already exists!",
        });
      }
    }

    const personData = { ...req.body };
    if (req.file) {
      personData.imageUrl = req.file.path;
      personData.image = req.file.path;
    }

    const newPerson = new Person(personData);
    await newPerson.save();
    res.status(201).json({
      success: true,
      message: "Record saved successfully!",
      data: newPerson,
    });
  } catch (error) {
    console.error("Add Person Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: persons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updatePersonStatus = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json({ success: true, data: updatedPerson });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

const deletePerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    const imagePath = person.imageUrl || person.image;
    if (imagePath && imagePath.includes("cloudinary")) {
      const urlParts = imagePath.split("/");
      const filename = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const publicId = `${folder}/${filename.split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await Person.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Record deleted from Cloud and DB" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalSheltered,
      reunited,
      escaped,
      dead,
      selfExited,
      newRescueRequests,
      rescuedPeople,
    ] = await Promise.all([
      Person.countDocuments({ status: "Sheltered" }),
      Person.countDocuments({ status: "Reunited" }),
      Person.countDocuments({ status: "Escaped" }),
      Person.countDocuments({ status: "Dead" }),
      Person.countDocuments({ status: "Self Exited" }),
      RescueRequest.countDocuments({
        status: { $in: ["Pending", "In Progress", "New"] },
      }),
      RescueRequest.countDocuments({ status: "Rescued" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSheltered,
        reunited,
        escaped,
        dead,
        selfExited,
        newRescueRequests,
        rescuedPeople,
      },
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
