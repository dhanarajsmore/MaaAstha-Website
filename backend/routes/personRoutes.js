const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const {
  addPerson,
  getAllPersons,
  updatePersonStatus,
  deletePerson,
  getDashboardStats,
} = require("../controllers/personController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/stats", getDashboardStats);
router.get("/all", protect, getAllPersons);
router.post("/add", protect, upload.single("image"), addPerson);
router.patch("/update/:id", protect, updatePersonStatus);
router.delete("/delete/:id", protect, restrictTo("superadmin"), deletePerson);

module.exports = router;
