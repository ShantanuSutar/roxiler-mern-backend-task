// routes/statisticsRoutes.js

const express = require("express");
const { getCombinedRoutes } = require("../controllers/getCombinedRoutes.js");

const router = express.Router();

router.get("/", getCombinedRoutes);

module.exports = router;
