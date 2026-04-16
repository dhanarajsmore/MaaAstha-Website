const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// 1. Saare Routes yahan IMPORT honge
const authRoutes = require("./routes/authRoutes");
const rescueRequestRoutes = require("./routes/rescueRequestRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const personRoutes = require("./routes/personRoutes");
const donationRoutes = require("./routes/donationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reportRoutes = require("./routes/reportRoutes");
const missingPersonRoutes = require("./routes/missingPersonRoutes");
const eventRoutes = require("./routes/eventRoutes");
const storyRoutes = require("./routes/storyRoutes");

dotenv.config();
connectDB();

const app = express();

// 2. 🔥 CORS FIX: Yahan "PATCH" add kar diya hai
app.use(cors({
  origin: "*", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.send("Maa Astha API is running perfectly! 🚀");
});

// 3. 🔥 ROUTE FIX: Saare raste (routes) yahan REGISTER honge
app.use("/api/auth", authRoutes);
app.use("/api/rescue-requests", rescueRequestRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/stories", storyRoutes);

// Uploads folder ko public banane ke liye
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});