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
  AddUser,
  getDoctorsByParameters,
} = require("../controllers/userController");
const {
  verifyTokenIsSameUserOrAdmin,
  verifyTokenIsAdmin,
  verifyTokenIsSameUser,
  verifyToken,
} = require("../middlewares/verifyToken");



//get doctors
router.get("/doctors", getAllDoctors);

// Get all users (only admin)
router.get("/", verifyTokenIsAdmin, getAllUsers);


// Add User
router.post("/AdminAddUser", AddUser);

// Get user by ID
router.get("/:id", verifyTokenIsAdmin, getUserById);

// Delete user by ID (only admin)
router.delete("/:id", verifyTokenIsAdmin, deleteUserById);

// Update user info (only admin and user)
router.put("/:id", verifyTokenIsSameUserOrAdmin, updateUserInfo);

// Get user by name route
router.post("/findUser", verifyTokenIsAdmin, getUserByName);

// Get user by id
router.post("/userInfo/:id", verifyTokenIsSameUserOrAdmin, getUserInfo);

// Get doctor by name
router.post("/findDoctor", verifyToken, getDoctorsByParameters);

module.exports = router;
