require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

// ── Connect to MongoDB ────────────────────────────────────────
connectDB();

const app = express();

// ── CORS FIX (IMPORTANT 🔥) ───────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:3000"],
  credentials: true
}));

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health Check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🐾 ResQPaws API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🐾 ================================
   ResQPaws Backend Running
   Port    : ${PORT}
   Mode    : ${process.env.NODE_ENV || "development"}
   Docs    : http://localhost:${PORT}/api/health
🐾 ================================
  `);
});