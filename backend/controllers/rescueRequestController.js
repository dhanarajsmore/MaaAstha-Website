const RescueRequest = require("../models/RescueRequest");
const { cloudinary } = require("../config/cloudinary");

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

    // 🔥 FIX: Cloudinary photo save logic updated
    let photoUrl = "";
    if (req.file && req.file.path) {
      photoUrl = req.file.path;
    }

    const request = await RescueRequest.create({
      location,
      condition,
      reporterName,
      reporterPhone,
      photoUrl,
    });

    res.status(201).json({ success: true, message: "Rescue request submitted successfully", data: request });
  } catch (error) {
    console.error("Rescue Request Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateRescueStatus = async (req, res) => {
  try {
    const updated = await RescueRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" },
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

const deleteRescueRequest = async (req, res) => {
  try {
    const request = await RescueRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.photoUrl && request.photoUrl.includes("cloudinary")) {
      const urlParts = request.photoUrl.split("/");
      const filename = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const publicId = `${folder}/${filename.split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await RescueRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Deleted securely from Database & Cloud",
    });
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