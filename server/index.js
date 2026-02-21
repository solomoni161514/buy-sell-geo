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

// --- Page routes (serve SPA index when available) ------------------------------
const path = require("path");
const fs = require("fs");
const buildPath = path.join(__dirname, "..", "dist");
const hasClientBuild = fs.existsSync(buildPath);

function sendAppPage(req, res) {
  if (hasClientBuild) {
    return res.sendFile(path.join(buildPath, "index.html"));
  }
  // fallback JSON when no client build is present
  return res.json({ page: req.path, ok: true });
}

// Serve SPA for main frontend routes so direct navigation works
app.get("/", sendAppPage);
app.get("/listings", sendAppPage);
app.get("/product/:id", sendAppPage);
app.get("/login", sendAppPage);
app.get("/register", sendAppPage);
app.get("/add-product", sendAppPage);

// --- Lightweight page APIs / helpers (coexist with full /api/* routes) -------
// Listings JSON (used by server-side testing or simple clients)
app.get("/api/page/listings", async (req, res) => {
  try {
    const products = await Product.find().limit(500).lean();
    return res.json({ page: "listings", count: products.length, products });
  } catch (err) {
    console.error("GET /api/page/listings error:", err);
    return res.status(500).json({ error: "Could not fetch listings" });
  }
});

// Product quick endpoints (create/update/delete)
app.post("/product", async (req, res) => {
  try {
    const created = await Product.create(req.body || {});
    return res.status(201).json(created);
  } catch (err) {
    console.error("POST /product error:", err);
    return res.status(400).json({ error: "Create failed" });
  }
});

app.patch("/product/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).lean();
    if (!updated) return res.status(404).json({ error: "Product not found" });
    return res.json(updated);
  } catch (err) {
    console.error("PATCH /product/:id error:", err);
    return res.status(400).json({ error: "Update failed" });
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id).lean();
    if (!removed) return res.status(404).json({ error: "Product not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /product/:id error:", err);
    return res.status(500).json({ error: "Delete failed" });
  }
});

// Minimal auth endpoints for quick integration (replace with real auth later)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Missing credentials" });
    const user = await User.findOne({ email, password }).lean();
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    return res.json({ user, token: "demo-token" });
  } catch (err) {
    console.error("POST /login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ error: "User exists" });
    const created = await User.create({ email, name, password });
    return res.status(201).json(created);
  } catch (err) {
    console.error("POST /register error:", err);
    return res.status(500).json({ error: "Register failed" });
  }
});
// -----------------------------------------------------------------------------

const http = require("http");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 4000;
const MAX_PORT_TRIES = 10;

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
