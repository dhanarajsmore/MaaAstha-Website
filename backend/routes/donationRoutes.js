const express = require("express");
const router = express.Router();
const { getDonations, addDonation } = require("../controllers/donationController");

router.get("/all", getDonations);
router.post("/add", addDonation);

module.exports = router;