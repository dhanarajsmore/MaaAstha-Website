const express = require("express");
const router = express.Router();
const { loginAdmin, seedAdmins } = require("../controllers/authController");

router.post("/login", loginAdmin);
router.post("/seed", seedAdmins);

module.exports = router;