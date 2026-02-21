require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/buysell";

async function run() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to", MONGO_URI);

  // Clear collections
  await User.deleteMany({});
  await Product.deleteMany({});

  const users = await User.create([
    { name: "Alice", email: "alice@example.com", password: "password" },
    { name: "Bob", email: "bob@example.com", password: "password" },
    {
      name: "Admin",
      email: "admin@example.com",
      password: "adminpass",
      role: "admin",
    },
  ]);

  const products = await Product.create([
    {
      title: "iPhone 12",
      description: "Good condition",
      price: 350,
      category: "electronics",
      images: [],
      seller: users[0]._id,
    },
    {
      title: "Mountain Bike",
      description: "Almost new",
      price: 500,
      category: "sports",
      images: [],
      seller: users[1]._id,
    },
    {
      title: "Vintage Camera",
      description: "Collector item",
      price: 120,
      category: "photography",
      images: [],
      seller: users[0]._id,
    },
  ]);

  console.log("Seeded users:", users.length, "products:", products.length);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
