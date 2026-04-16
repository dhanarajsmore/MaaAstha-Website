const express = require("express");
const router = express.Router();
const { loginAdmin, seedAdmins } = require("../controllers/authController");

// Login ke liye POST
router.post("/login", loginAdmin);

// 🔥 Seed ke liye GET (Ab "Cannot GET" nahi aayega)
router.get("/seed", seedAdmins); 

module.exports = router;