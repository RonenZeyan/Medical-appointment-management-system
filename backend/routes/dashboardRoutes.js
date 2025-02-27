//modules imports
const express = require("express");
const { getDashboardDataNumber } = require("../controllers/dashboardController");
const { verifyTokenIsAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/general-num",verifyTokenIsAdmin, getDashboardDataNumber);

module.exports = router;
