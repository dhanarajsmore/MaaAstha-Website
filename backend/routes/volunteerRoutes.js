const express = require("express");
const router = express.Router();
const { getVolunteers, addVolunteer } = require("../controllers/volunteerController");

router.get("/all", getVolunteers);
router.post("/add", addVolunteer);

module.exports = router;