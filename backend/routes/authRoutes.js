//modules imports
const express = require("express");
const { registerUser, loginUser ,changePassword} = require("../controllers/authController");
const { verifyTokenIsAdmin, verifyTokenIsSameUserOrAdmin, verifyToken,verifyTokenIsSameUser } = require("../middlewares/verifyToken");
const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// User passwrod change route
router.patch("/change-password/:id",verifyTokenIsSameUser, changePassword);


module.exports = router;
