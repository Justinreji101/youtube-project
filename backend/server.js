const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutesModule = require("./routes/authRoutes");
const youtubeRoutesModule = require("./routes/youtubeRoutes");

const authRoutes =
  authRoutesModule.router || authRoutesModule.default || authRoutesModule;

const youtubeRoutes =
  youtubeRoutesModule.router || youtubeRoutesModule.default || youtubeRoutesModule;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  })
);

app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Youtube-project API working ✅"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully ✅"
  });
});

console.log("authRoutes type:", typeof authRoutes);
console.log("youtubeRoutes type:", typeof youtubeRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err.message);
  });