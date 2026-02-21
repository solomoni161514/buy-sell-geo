const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// escape text for regex
function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const filter = {};
    const { category, type, brand, priceMin, priceMax, q, loc } = req.query;
    if (category) filter.category = String(category);
    if (type) filter.type = String(type);
    if (brand) filter.brand = String(brand);
    // full text-ish search across multiple fields
    if (q) {
      // normalize the query (NFKC) to improve matching across Unicode inputs
      const s = String(q).trim().normalize("NFKC");
      if (s.length > 0) {
        // use unicode-aware regex along with case-insensitive flag to better match non-Latin scripts
        const re = new RegExp(escapeRegex(s), "iu");
        filter.$or = [
          { title: re },
          { description: re },
          { location: re },
          { category: re },
          { brand: re },
        ];
      }
    }
    // optional location-only filter (also supported via q above)
    if (loc) {
      const ls = String(loc).trim().normalize("NFKC");
      const lr = new RegExp(escapeRegex(ls), "iu");
      filter.location = lr;
    }
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }
    const products = await Product.find(filter)
      .limit(200)
      .populate("seller", "name email");
    // optional localization: if lang param provided, prefer localized fields
    const lang = req.query.lang ? String(req.query.lang) : null;
    if (lang) {
      const mapped = products.map((p) => {
        const obj = p.toObject ? p.toObject() : p;
        if (obj.title_i18n && obj.title_i18n[lang])
          obj.title = obj.title_i18n[lang];
        if (obj.description_i18n && obj.description_i18n[lang])
          obj.description = obj.description_i18n[lang];
        return obj;
      });
      return res.json(mapped);
    }
    res.json(products);
  } catch (err) {
    console.error("product list error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/products - protected, only admin
router.post("/", auth, async (req, res) => {
  try {
    // only admin
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    const body = { ...req.body, seller: req.user._id };
    const p = await Product.create(body);
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id - admin only
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    console.log("DELETE /api/products/:id", req.params.id, "by", req.user._id);
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

// PATCH /api/products/:id - admin only, partial update
router.patch("/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    const updates = { ...req.body };
    // prevent changing seller via this endpoint
    delete updates.seller;
    const p = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("seller", "name email");
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: "Invalid id or data" });
  }
});

// GET /api/products/categories - returns counts per category
router.get("/categories", async (req, res) => {
  try {
    const rows = await Product.aggregate([
      { $match: { category: { $exists: true, $ne: null } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    // convert to object
    const out = {};
    rows.forEach((r) => {
      out[r._id] = r.count;
    });
    res.json(out);
  } catch (err) {
    console.error("categories aggregation error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/:id - product detail
router.get("/:id", async (req, res) => {
  try {
    console.log("GET /api/products/:id", req.params.id);
    const p = await Product.findById(req.params.id).populate(
      "seller",
      "name email",
    );
    console.log("product lookup result:", !!p);
    if (!p) return res.status(404).json({ error: "Not found" });
    // apply localization if requested
    const lang = req.query.lang ? String(req.query.lang) : null;
    let out = p;
    if (lang) {
      const obj = p.toObject();
      if (obj.title_i18n && obj.title_i18n[lang])
        obj.title = obj.title_i18n[lang];
      if (obj.description_i18n && obj.description_i18n[lang])
        obj.description = obj.description_i18n[lang];
      out = obj;
    }
    res.json(out);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

module.exports = router;
