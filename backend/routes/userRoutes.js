//modules imports
const express = require("express");
const { getAllDoctors, getUserByName,
    getAllUsers,
    deleteUserById,
    updateUserInfo } = require("../controllers/userController");
    const { verifyTokenIsSameUserOrAdmin, verifyTokenIsAdmin, verifyTokenIsSameUser, verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

//get doctors
router.get("/doctors", getAllDoctors);

// Get user by name
router.post("/findUser",verifyTokenIsAdmin, getUserByName);

// Get all users (only admin)
router.get("/",verifyTokenIsAdmin, getAllUsers);

// Delete user by ID (only admin)
router.delete("/:id",verifyTokenIsAdmin, deleteUserById);

// Update user info (only admin and user)
router.put("/:id", verifyTokenIsSameUserOrAdmin, updateUserInfo);

module.exports = router;
