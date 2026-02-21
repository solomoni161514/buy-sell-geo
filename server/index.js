require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configure CORS from env: CORS_ORIGIN can be a comma-separated list of allowed origins.
const rawCors = process.env.CORS_ORIGIN;
const corsOptions = rawCors
  ? {
      origin: rawCors.split(",").map((s) => s.trim()),
      credentials: true,
    }
  : {
      origin: true, // allow all if not specified
      credentials: true,
    };
app.use(cors(corsOptions));
// optional: expose CORS config in logs
console.log("CORS configured:", rawCors || "allow all");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/buysell";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Models
const User = require("./models/User");
const Product = require("./models/Product");

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));

const http = require("http");
const path = require("path");
const fs = require("fs");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 4000;
const MAX_PORT_TRIES = 10;

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

function tryListen(portToTry, attempt = 0) {
  const server = http.createServer(app);

  server.once("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.warn(`Port ${portToTry} in use`);
      if (attempt < MAX_PORT_TRIES) {
        const nextPort = portToTry + 1;
        console.log(`Trying port ${nextPort} (attempt ${attempt + 1})`);
        // small delay before retrying
        setTimeout(() => tryListen(nextPort, attempt + 1), 200);
        return;
      }
      console.error(
        `All ports ${DEFAULT_PORT}-${DEFAULT_PORT + MAX_PORT_TRIES} are in use. Exiting.`,
      );
      process.exit(1);
    }
    console.error("Server error:", err);
    process.exit(1);
  });

  server.listen(portToTry, () => {
    console.log(`API listening on ${portToTry}`);
  });
}

tryListen(DEFAULT_PORT);

// If a client build exists (Vite output in ../dist), serve it as a static SPA
try {
  const buildPath = path.join(__dirname, "..", "dist");
  if (fs.existsSync(buildPath)) {
    console.log("Serving client build from", buildPath);
    app.use(express.static(buildPath, { maxAge: "1d" }));
    // fallback to index.html for SPA routes (but do not override API routes)
    app.get("*", (req, res, next) => {
      // if request starts with /api, skip
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(buildPath, "index.html"));
    });
  }
} catch (e) {
  // ignore
}
