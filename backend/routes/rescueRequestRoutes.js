const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getRescueRequests, addRescueRequest } = require("../controllers/rescueRequestController");

// Upload folder setup
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.get("/all", getRescueRequests);
router.post("/add", upload.single("photo"), addRescueRequest);

module.exports = router;