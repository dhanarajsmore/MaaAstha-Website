const express = require("express");
const router = express.Router();
const {
  addVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
} = require("../controllers/volunteerController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/add", addVolunteer);
router.get("/all", protect, getVolunteers);
router.patch("/update/:id", protect, updateVolunteerStatus);
router.delete(
  "/delete/:id",
  protect,
  restrictTo("superadmin"),
  deleteVolunteer,
);

module.exports = router;
