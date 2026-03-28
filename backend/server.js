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

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ── Allowed Frontend URLs ─────────────────────────────
const CLIENT_URLS = (
  "http://localhost:5173,http://127.0.0.1:5173," + (process.env.CLIENT_URL || "")
)
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const ALLOW_ALL_ORIGINS = CLIENT_URLS.includes("*");

// ── Validate ENV ─────────────────────────────────────
function validateEnv() {
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
  }

  if (NODE_ENV === "production" && (process.env.JWT_SECRET || "").length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production.");
  }
}

// ── Connect DB ───────────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────────
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, "");
      if (!origin || ALLOW_ALL_ORIGINS || CLIENT_URLS.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ── Health Routes ────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🐾 ResQPaws API is running.",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "resqpaws-backend",
    status: "healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);



// Not found handler
// ── 404 Handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global Error Handler ─────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────
const start = async () => {
  try {
    validateEnv();

    const server = app.listen(PORT, () => {
      console.log(`
🐾 ================================
   ResQPaws Backend Running
   Port    : ${PORT}
   Mode    : ${NODE_ENV}
   Health  : http://localhost:${PORT}/api/health
🐾 ================================
      `);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} already in use.`);
      } else {
        console.error("Server error:", error.message);
      }
      process.exit(1);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

start();