//modules imports
const express = require("express");
const { getAllDoctors } = require("../controllers/userController");
const router = express.Router();

router.get("/doctors",getAllDoctors);

module.exports = router;
