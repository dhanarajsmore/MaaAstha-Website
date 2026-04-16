const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary"); 
const {
  addRescueRequest,
  getRescueRequests,
  updateRescueStatus,
  deleteRescueRequest,
} = require("../controllers/rescueRequestController");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.get("/all", protect, getRescueRequests);

// 🔥 FIX: "image" ko "photo" kar diya taaki frontend se match ho
router.post("/add", upload.single("photo"), addRescueRequest);

router.patch("/update/:id", protect, updateRescueStatus);
router.delete("/delete/:id", protect, deleteRescueRequest);

module.exports = router;