import express from "express";
import cors from "cors"; // ✅ Keep this import
import morgan from "morgan";
import mongoose from "mongoose";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Config
const PORT = 5000;
const FRONTEND_URL = "https://taskmanagerappneww.vercel.app";
const MONGODB_URI = "mongodb+srv://Nagul:nagul03@shop.jkysbyh.mongodb.net/?retryWrites=true&w=majority&appName=Shop";
const NODE_ENV = "development";

// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Atlas connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

// ✅ Setup CORS correctly
app.use(cors({
  origin: [FRONTEND_URL],
  credentials: true,
}));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin", adminRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Server Error",
    stack: NODE_ENV === "production" ? undefined : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
