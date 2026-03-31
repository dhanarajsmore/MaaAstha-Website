const express = require("express");
const router = express.Router();
const multer = require("multer"); // ✅ Multer import kiya
const path = require("path");

const {
  addRescueRequest,
  getRescueRequests,
  updateRescueStatus,
  deleteRescueRequest,
} = require("../controllers/rescueRequestController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// ✅ Multer Storage Setup for Photo Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 'uploads/' folder tere backend mein hona chahiye
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    // File ka naam unique banane ke liye time attach kar diya
    cb(null, "rescue-" + Date.now() + path.extname(file.originalname));
  },
});

// ✅ Multer middleware banaya (Frontend se 'image' naam ki file aayegi)
const upload = multer({ storage: storage });

// 🔥 MAIN FIX: Route mein 'upload.single("image")' middleware add kiya
router.post("/add", upload.single("image"), addRescueRequest);

router.get("/all", protect, getRescueRequests);
router.patch("/update/:id", protect, updateRescueStatus);
router.delete(
  "/delete/:id",
  protect,
  restrictTo("superadmin"),
  deleteRescueRequest,
);

module.exports = router;