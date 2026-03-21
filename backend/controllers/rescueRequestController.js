const RescueRequest = require("../models/RescueRequest");

const getRescueRequests = async (req, res) => {
  try {
    const requests = await RescueRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addRescueRequest = async (req, res) => {
  try {
    const { location, condition, reporterName, reporterPhone } = req.body;

    if (!location || !condition || !reporterPhone) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const request = await RescueRequest.create({
      location,
      condition,
      reporterName,
      reporterPhone,
      photoUrl,
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getRescueRequests, addRescueRequest };
