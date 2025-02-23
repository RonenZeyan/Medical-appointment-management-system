const express = require("express");
const router = express.Router();
const { 
    getUserByName, 
    getAllUsers, 
    deleteUserById, 
    updateUserInfo 
} = require("../controllers/userController");
const { verifyTokenIsSameUserOrAdmin, verifyTokenIsAdmin, verifyTokenIsSameUser, verifyToken } = require("../middlewares/verifyToken");


// Get user by name
router.post("/findUser",verifyTokenIsAdmin, getUserByName);

// Get all users (only admin)
router.get("/",verifyTokenIsAdmin, getAllUsers);

// Delete user by ID (only admin)
router.delete("/:id",verifyTokenIsAdmin, deleteUserById);

// Update user info (only admin and user)
router.put("/:id", verifyTokenIsSameUserOrAdmin, updateUserInfo);

module.exports = router;