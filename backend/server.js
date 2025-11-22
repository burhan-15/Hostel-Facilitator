import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Server is running" 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
