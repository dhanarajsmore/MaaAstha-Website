const express = require("express");
const router = express.Router();
const {
  addDonation,
  getDonations,
  updateDonationStatus,
  deleteDonation,
} = require("../controllers/donationController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/add", addDonation);
router.get("/all", protect, getDonations);
router.patch("/update/:id", protect, updateDonationStatus);
router.delete("/delete/:id", protect, restrictTo("superadmin"), deleteDonation);

module.exports = router;
