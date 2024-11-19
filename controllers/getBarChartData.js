// controllers/statisticsController.js
const Product = require("../models/Product");

// Helper function to format month and match it against the dateOfSale field
const getMonthFromDate = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[new Date(date).getMonth()];
};

const getBarChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = new Date(`${month} 01, 2000`).getMonth() + 1; // Get the month number (1-12)

    // Aggregation pipeline to group products by price ranges and match the month
    const pipeline = [
      // Stage 1: Match the products for the selected month by extracting the month directly from dateOfSale
      {
        $match: {
          $expr: {
            $eq: [
              { $month: "$dateOfSale" }, // Extract month from dateOfSale
              monthNumber, // Match with the input month
            ],
          },
        },
      },
      // Stage 2: Group by price ranges
      {
        $bucket: {
          groupBy: "$price", // Group by the price field
          boundaries: [
            0,
            100,
            200,
            300,
            400,
            500,
            600,
            700,
            800,
            900,
            Infinity,
          ], // Price range boundaries
          default: "Others", // For prices above the last boundary (900+)
          output: {
            count: { $sum: 1 }, // Count the number of items in each price range
          },
        },
      },
      // Stage 3: Map the ranges to their string representations
      {
        $project: {
          _id: 0,
          priceRange: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0 - 100" },
                { case: { $eq: ["$_id", 100] }, then: "101 - 200" },
                { case: { $eq: ["$_id", 200] }, then: "201 - 300" },
                { case: { $eq: ["$_id", 300] }, then: "301 - 400" },
                { case: { $eq: ["$_id", 400] }, then: "401 - 500" },
                { case: { $eq: ["$_id", 500] }, then: "501 - 600" },
                { case: { $eq: ["$_id", 600] }, then: "601 - 700" },
                { case: { $eq: ["$_id", 700] }, then: "701 - 800" },
                { case: { $eq: ["$_id", 800] }, then: "801 - 900" },
                { case: { $gte: ["$_id", 900] }, then: "901-above" },
              ],
              default: "Others",
            },
          },
          count: 1,
        },
      },
    ];

    // Execute the aggregation
    const barChartData = await Product.aggregate(pipeline);

    res.json(barChartData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getBarChartData };
