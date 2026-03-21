const express = require("express");
const router = express.Router();
const {
  addPerson,
  getAllPersons,
  updatePersonStatus,
  deletePerson,
  getDashboardStats,
} = require("../controllers/personController");

router.get("/stats", getDashboardStats);

router.post("/add", addPerson);
router.get("/all", getAllPersons);
router.patch("/update/:id", updatePersonStatus);
router.delete("/delete/:id", deletePerson);

module.exports = router;
