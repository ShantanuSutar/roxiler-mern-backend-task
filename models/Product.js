const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean, // Include if relevant
  dateOfSale: Date, // Add the dateOfSale field for filtering
});

module.exports = mongoose.model("Product", ProductSchema);
