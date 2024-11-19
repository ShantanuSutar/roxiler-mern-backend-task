// controllers/statisticsController.js

const Product = require("../models/Product");

const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Derive month number from the month name
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1; // Adding 1 because months are 0-indexed

    if (isNaN(monthNumber)) {
      return res.status(400).json({ message: "Invalid month name" });
    }

    console.log("Month number derived:", monthNumber);

    // Aggregate the statistics
    const totalSaleAmount = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber], // Directly use the $month operator on dateOfSale
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
        },
      },
    ]);

    const totalSoldItems = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber], // Directly use the $month operator on dateOfSale
          },
          sold: true,
        },
      },
      { $count: "soldItems" },
    ]);

    const totalNotSoldItems = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber], // Directly use the $month operator on dateOfSale
          },
          sold: false,
        },
      },
      { $count: "notSoldItems" },
    ]);

    res.json({
      totalSaleAmount: totalSaleAmount[0]
        ? totalSaleAmount[0].totalSaleAmount
        : 0,
      totalSoldItems: totalSoldItems[0] ? totalSoldItems[0].soldItems : 0,
      totalNotSoldItems: totalNotSoldItems[0]
        ? totalNotSoldItems[0].notSoldItems
        : 0,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getStatistics };
