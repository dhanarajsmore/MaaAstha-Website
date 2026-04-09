const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const personRoutes = require("./routes/personRoutes");
const donationRoutes = require("./routes/donationRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const rescueRequestRoutes = require("./routes/rescueRequestRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reportRoutes = require("./routes/reportRoutes");
const missingPersonRoutes = require("./routes/missingPersonRoutes");
const storyRoutes = require("./routes/storyRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://maa-astha-website-n0p86t2hf-2024dhanarajmore-5931s-projects.vercel.app"], 
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Maa Astha API is running perfectly! 🚀");
});

app.use("/api/persons", personRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/rescue-requests", rescueRequestRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
