const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const personRoutes = require("./routes/personRoutes");

const path = require("path");
const donationRoutes = require("./routes/donationRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const rescueRequestRoutes = require("./routes/rescueRequestRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Maa Astha API is running perfectly! 🚀");
});

app.use("/api/persons", personRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/rescue-requests", rescueRequestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
