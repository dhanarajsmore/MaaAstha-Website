const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  addPerson,
  getAllPersons,
  updatePersonStatus,
  deletePerson,
  getDashboardStats,
} = require("../controllers/personController");

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`),
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/stats", getDashboardStats);
router.post("/add", upload.single("image"), addPerson);
router.get("/all", getAllPersons);
router.patch("/update/:id", updatePersonStatus);
router.delete("/delete/:id", deletePerson);

module.exports = router;