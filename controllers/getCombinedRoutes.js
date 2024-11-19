const axios = require("axios");

const getCombinedRoutes = async (req, res) => {
  try {
    // Extract the month parameter
    const month = req.query.month;

    // Fetch data from the APIs using axios
    const [statisticsResponse, barChartResponse, pieChartResponse] =
      await Promise.all([
        axios.get(`http://localhost:3000/api/statistics?month=${month}`),
        axios.get(
          `http://localhost:3000/api/statistics/bar-chart?month=${month}`
        ),
        axios.get(
          `http://localhost:3000/api/statistics/piechart?month=${month}`
        ),
      ]);

    // Combine the data
    const combinedData = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    // Send the combined response
    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching combined data." });
  }
};

module.exports = { getCombinedRoutes };
