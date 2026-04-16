const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: admin._id,
          username: admin.username,
          role: admin.role,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const seedAdmins = async (req, res) => {
  try {
    await Admin.deleteMany({}); // Sab purana clear
    await Admin.create({
      username: "superkush",
      password: "admin123",
      role: "superadmin",
    });
    await Admin.create({
      username: "ngosir",
      password: "ngo123",
      role: "admin",
    });
    res.status(201).json({ success: true, message: "Accounts force reset and secured!" });
  } catch (error) {
    console.error("Seed Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { loginAdmin, seedAdmins };