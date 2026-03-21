const Person = require("../models/Person");

// Add a new person
const addPerson = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      address,
      mobileNo,
      idDocument,
      arrivalDateTime,
      broughtBy,
      reason,
      condition,
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
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields!",
      });
    }

    const newPerson = new Person({
      fullName,
      age,
      gender,
      address,
      mobileNo,
      idDocument,
      arrivalDateTime,
      broughtBy,
      reason,
      condition,
    });

    const savedPerson = await newPerson.save();

    res.status(201).json({
      success: true,
      message: "Record saved successfully in Maa Astha Database!",
      data: savedPerson,
    });
  } catch (error) {
    console.error("Error adding person:", error);
    res.status(500).json({
      success: false,
      message: "Server Error, could not save data.",
    });
  }
};

// Get all persons
const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: persons,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({
      success: false,
      message: "Server Error, could not fetch data.",
    });
  }
};

// @desc    Update person status (e.g., Sheltered -> Reunited)
// @route   PATCH /api/persons/update/:id
const updatePersonStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.status(200).json({ success: true, data: updatedPerson });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// @desc    Delete a record
// @route   DELETE /api/persons/delete/:id
const deletePerson = async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// @desc    Get stats for Dashboard
// @route   GET /api/persons/stats
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Sheltered count
    const totalSheltered = await Person.countDocuments({ status: "Sheltered" });

    // 2. Reunited count
    const reunited = await Person.countDocuments({ status: "Reunited" });

    // 3. Medical Emergency count
    const medicalNeeds = await Person.countDocuments({
      status: "Medical Emergency",
    });

    // 4. Recently Added
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAdded = await Person.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        totalSheltered,
        reunited,
        medicalNeeds,
        recentlyAdded,
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
