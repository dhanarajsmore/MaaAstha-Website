const express = require("express");
const router = express.Router();
const { getVolunteers, addVolunteer, updateVolunteerStatus, deleteVolunteer } = require("../controllers/volunteerController");

router.get("/all", getVolunteers);
router.post("/add", addVolunteer);
router.patch("/update/:id", updateVolunteerStatus);
router.delete("/delete/:id", deleteVolunteer);

module.exports = router;