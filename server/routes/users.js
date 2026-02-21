const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

function makeToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  const secret = process.env.JWT_SECRET || "devsecret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

// GET /api/users - list
router.get("/", async (req, res) => {
  const users = await User.find().select("-password").limit(100);
  res.json(users);
});

// POST /api/users - create (register) -> returns token and user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const u = user.toObject();
    delete u.password;
    const token = makeToken(user);
    res.status(201).json({ user: u, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing credentials" });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const u = user.toObject();
  delete u.password;
  const token = makeToken(user);
  res.json({ user: u, token });
});

module.exports = router;

// PATCH /api/users/theme - update theme preference for authenticated user
router.patch("/theme", auth, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { theme } = req.body;
    if (!["light", "dark"].includes(theme))
      return res.status(400).json({ error: "Invalid theme" });
    const u = await User.findByIdAndUpdate(
      req.user._id,
      { theme },
      { new: true },
    ).select("-password");
    res.json({ user: u });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
