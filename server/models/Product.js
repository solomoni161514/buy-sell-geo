const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // localized titles e.g. { en: 'Phone', ka: 'ტელეფონი' }
  title_i18n: { type: Map, of: String },
  description: { type: String },
  // localized descriptions
  description_i18n: { type: Map, of: String },
  price: { type: Number, required: true },
  category: { type: String },
  // listing type: 'sell' or 'rent'
  type: { type: String, enum: ["sell", "rent"], default: "sell" },
  brand: { type: String },
  images: { type: [String], default: [] },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
