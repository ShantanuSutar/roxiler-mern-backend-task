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

// Controller method to get the statistics for pie chart
const getPieChartData = async (req, res) => {
  const { month } = req.query;

  try {
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Convert the month name to a number (1-12)
    const monthNumber = new Date(`${month} 1, 2000`).getMonth(); // Converts month to 0-11
    if (isNaN(monthNumber)) {
      return res.status(400).json({ message: "Invalid month provided" });
    }

    // Build aggregation pipeline
    const pipeline = [
      // Stage 1: Match products that belong to the selected month
      {
        $match: {
          // Ensure dateOfSale is a valid date and extract the month directly
          dateOfSale: { $exists: true, $ne: null },
        },
      },
      // Stage 2: Add a field to extract the month from the dateOfSale
      {
        $addFields: {
          saleMonth: {
            $month: "$dateOfSale", // Extract the month from the dateOfSale field (already a Date type)
          },
        },
      },
      // Stage 3: Match products that belong to the selected month
      {
        $match: {
          saleMonth: monthNumber + 1, // MongoDB month is 1-based, JavaScript is 0-based
        },
      },
      // Stage 4: Group by category and count the number of items in each category
      {
        $group: {
          _id: "$category", // Group by category
          itemCount: { $sum: 1 }, // Count the number of items
        },
      },
      // Stage 5: Project the result in a friendly format
      {
        $project: {
          category: "$_id",
          itemCount: 1,
          _id: 0, // Exclude the MongoDB default _id field
        },
      },
    ];

    // Execute aggregation
    const pieChartData = await Product.aggregate(pipeline);

    // Return the results
    res.json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPieChartData };
