//modules imports
const express = require("express");
const { registerUser, loginUser ,AddUser} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/AdminAddUser", AddUser);

router.post("/login", loginUser);


module.exports = router;
