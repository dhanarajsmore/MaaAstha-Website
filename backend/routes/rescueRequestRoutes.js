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

router.get("/all", protect, getRescueRequests);
router.post("/add", upload.single("image"), addRescueRequest);
router.patch("/update/:id", protect, updateRescueStatus);
router.delete("/delete/:id", protect, deleteRescueRequest);

module.exports = router;