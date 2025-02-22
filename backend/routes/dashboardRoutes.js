//modules imports
const express = require("express");
const { getDashboardDataNumber } = require("../controllers/dashboardController");
const router = express.Router();

router.get("/general-num", getDashboardDataNumber);

module.exports = router;
