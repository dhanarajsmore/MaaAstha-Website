const RescueRequest = require("../models/RescueRequest");
const { cloudinary } = require("../config/cloudinary");

// 1. Get All Requests
const getRescueRequests = async (req, res) => {
  try {
    const requests = await RescueRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. Add New Request
const addRescueRequest = async (req, res) => {
  try {
    const { location, condition, reporterName, reporterPhone } = req.body;

    if (!location || !condition || !reporterPhone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let photoUrl = "";
    if (req.file) {
      photoUrl = req.file.path; // Cloudinary automatically gives the URL here
    }

    const request = await RescueRequest.create({
      location,
      condition,
      reporterName,
      reporterPhone,
      photoUrl,
    });

    res.status(201).json({ success: true, message: "Rescue alert sent successfully", data: request });
  } catch (error) {
    console.error("Rescue Request Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 3. Update Status
const updateRescueStatus = async (req, res) => {
  try {
    const updated = await RescueRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// 4. Delete Request
const deleteRescueRequest = async (req, res) => {
  try {
    const request = await RescueRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Delete image from Cloudinary if exists
    if (request.photoUrl && request.photoUrl.includes("cloudinary")) {
      try {
        const urlParts = request.photoUrl.split("/");
        const filename = urlParts[urlParts.length - 1].split(".")[0];
        const folder = urlParts[urlParts.length - 2];
        await cloudinary.uploader.destroy(`${folder}/${filename}`);
      } catch (err) {
        console.error("Cloudinary Delete Error:", err);
      }
    }

    await RescueRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = {
  getRescueRequests,
  addRescueRequest,
  updateRescueStatus,
  deleteRescueRequest,
};