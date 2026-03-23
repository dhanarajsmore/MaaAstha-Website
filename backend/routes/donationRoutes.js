const express = require("express");
const router = express.Router();
const { getDonations, addDonation, updateDonationStatus, deleteDonation } = require("../controllers/donationController");

router.get("/all", getDonations);
router.post("/add", addDonation);
router.patch("/update/:id", updateDonationStatus);
router.delete("/delete/:id", deleteDonation);

module.exports = router;