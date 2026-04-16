const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Routes Import
const authRoutes = require("./routes/authRoutes");
const rescueRequestRoutes = require("./routes/rescueRequestRoutes");
const missingPersonRoutes = require("./routes/missingPersonRoutes");
// ... baki routes bhi isi tarah import karle ...

dotenv.config();
connectDB();

const app = express();

// 🔥 CORS Fix: Sab allow kar diya debugging ke liye
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// Routes Setup
app.use("/api/auth", authRoutes);
app.use("/api/rescue-requests", rescueRequestRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Maa Astha API is running perfectly! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});