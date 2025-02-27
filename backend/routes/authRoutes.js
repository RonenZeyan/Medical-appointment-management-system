//modules imports
const express = require("express");
const { registerUser, loginUser ,AddUser} = require("../controllers/authController");
const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);


module.exports = router;
