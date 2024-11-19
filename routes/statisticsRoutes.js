// routes/statisticsRoutes.js

const express = require("express");
const { getStatistics } = require("../controllers/getStatistics");
const { getBarChartData } = require("../controllers/getBarChartData.js");
const { getPieChartData } = require("../controllers/getPieChartData.js");
const router = express.Router();

router.get("/", getStatistics);
router.get("/bar-chart", getBarChartData);
router.get("/piechart", getPieChartData);

module.exports = router;
