const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Health checks
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "ResQPaws API is running." });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "resqpaws-backend",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// DB + server startup
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
