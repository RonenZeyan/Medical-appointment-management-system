const express = require("express");

const router = express.Router();

const { 
    getUserByName, 
    getAllUsers, 
    deleteUserById, 
    updateUserInfo,
    getAllDoctors,
    getUserById,
    getUserInfo,
    getDoctorByName,

} = require("../controllers/userController");
const {
  verifyTokenIsSameUserOrAdmin,
  verifyTokenIsAdmin,
  verifyTokenIsSameUser,
  verifyToken,
} = require("../middlewares/verifyToken");

// Get user by name route
router.post("/findUser", verifyTokenIsAdmin, getUserByName);

//get doctors
router.get("/doctors", getAllDoctors);

// Get all users (only admin)
router.get("/", verifyTokenIsAdmin, getAllUsers);

// Get user by name
router.post("/findDoctor",verifyToken, getDoctorByName);

// Get user by id
router.post("/userInfo/:id",verifyTokenIsSameUserOrAdmin, getUserInfo);


// Delete user by ID (only admin)
router.delete("/:id", verifyTokenIsAdmin, deleteUserById);

// Update user info (only admin and user)
router.put("/:id", verifyTokenIsSameUserOrAdmin, updateUserInfo);

// Get user by ID
router.get("/:id", verifyTokenIsAdmin, getUserById);

module.exports = router;
