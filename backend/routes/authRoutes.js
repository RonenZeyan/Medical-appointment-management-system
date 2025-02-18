//modules imports 
const express = require("express");
const router = express.Router();

/**
 * @description Register New User
 * @router /api/auth/register
 * @method POST
 * @access public
 */
const registerUser = async (req, res) => {
    try {
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


/**
 * @description Login User
 * @router /api/auth/login
 * @method POST
 * @access public
 */
const loginUser = async (req, res) => {
    try {
        res.status(201).json({ message: "User login successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


router.post("/register", registerUser);
router.post("/login", loginUser);


module.exports = router;
