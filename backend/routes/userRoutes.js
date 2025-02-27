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

// Get user by id
router.post("/userInfo/:id",verifyTokenIsSameUserOrAdmin, getUserInfo);

// Get user by ID
// router.get("/:id", verifyTokenIsAdmin, getUserById);


// Get all users (only admin)
router.get("/", verifyTokenIsAdmin, getAllUsers);

// Delete user by ID (only admin)
router.delete("/:id", verifyTokenIsAdmin, deleteUserById);

// Update user info (only admin and user)
router.put("/:id", verifyTokenIsSameUserOrAdmin, updateUserInfo);

//get doctors
router.get("/doctors", getAllDoctors);
// Get user by name
router.post("/findDoctor",verifyToken, getDoctorByName);


module.exports = router;
