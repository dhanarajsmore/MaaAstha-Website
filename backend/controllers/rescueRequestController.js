const RescueRequest = require("../models/RescueRequest");

const addRescueRequest = async (req, res) => {
  try {
    const { location, condition, reporterName, reporterPhone } = req.body;

    // Validation
    if (!location || !condition || !reporterPhone) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    // Photo URL check (Cloudinary se path milta hai)
    let photoUrl = "";
    if (req.file) {
      photoUrl = req.file.path; // Multer-storage-cloudinary automatically sets 'path' as the URL
    }

    const request = await RescueRequest.create({
      location,
      condition,
      reporterName,
      reporterPhone,
      photoUrl,
    });

    res.status(201).json({ 
      success: true, 
      message: "Rescue alert sent! Help is on the way.", 
      data: request 
    });

  } catch (error) {
    console.error("Rescue Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Backend processing failed", 
      error: error.message 
    });
  }
};

// ... baki functions (get, update, delete) same rahenge jo tune bheje the ...
module.exports = { addRescueRequest, getRescueRequests, updateRescueStatus, deleteRescueRequest };