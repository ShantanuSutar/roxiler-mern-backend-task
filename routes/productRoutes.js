const express = require("express");
const { initializeDatabase } = require("../controllers/initialize");
const { getTransactions } = require("../controllers/getTransactions");
const router = express.Router();

router.get("/initialize", initializeDatabase);
router.get("/transactions", getTransactions);

module.exports = router;
