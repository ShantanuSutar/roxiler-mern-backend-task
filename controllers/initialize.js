const axios = require("axios");
const Product = require("../models/Product");

const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const products = response.data;

    // Clear existing data
    await Product.deleteMany();

    // Insert new data
    await Product.insertMany(products);

    res.status(200).json({
      message: "Database initialized successfully!",
      totalRecords: products.length,
    });
  } catch (error) {
    console.error("Error initializing database:", error.message);
    res.status(500).json({ error: "Database initialization failed." });
  }
};

module.exports = { initializeDatabase };
