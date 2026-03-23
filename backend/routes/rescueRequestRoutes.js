const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getRescueRequests, addRescueRequest, updateRescueStatus, deleteRescueRequest } = require("../controllers/rescueRequestController");

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/all", getRescueRequests);
router.post("/add", upload.single("photo"), addRescueRequest);
router.patch("/update/:id", updateRescueStatus);
router.delete("/delete/:id", deleteRescueRequest);

module.exports = router;