import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Allow your Vercel domain in .env
  credentials: true,
}));

app.use(morgan("dev"));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin", adminRoutes);

// Default route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
