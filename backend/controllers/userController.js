
const {User} = require("../models/User");


/**
 * @description Get All doctors
 * @router /api/users/doctors
 * @method GET
 * @access private (only admin)
 */

const getAllDoctors = async (req, res) => {
    try {
      const doctors = await User.find({role:"doctor"}).select("-password");
      res.status(200).json(doctors);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    }
  };

/**
 * @description Get user by name
 * @router /api/users/find
 * @method POST
 * @access Private (only admin)
 */
const getUserByName = async (req, res) => {
  try {
    const { full_name } = req.body;

    if (!full_name) {
      return res.status(400).json({ message: "User name is required" });
    }

    // Search for the user by full name (case-insensitive)
    const userFullName = await User.findOne({
      full_name
    }).select("-password"); // Exclude password from results

    if (!userFullName) {
      return res.status(404).json({ message: "user name not found" });
    }

    res.status(200).json(userFullName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get all users
 * @router /api/users
 * @method GET
 * @access Private (only admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Delete user by ID
 * @router /api/users/:id
 * @method DELETE
 * @access Private (only admin)
 */
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Update user information
 * @router /api/users/:id
 * @method PUT
 * @access Private (only admin and user)
 */
const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating password directly through this route
    if (updateData.password) {
      return res
        .status(400)
        .json({ message: "Use the password update feature separately" });
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  getUserByName,
  getAllUsers,
  deleteUserById,
  updateUserInfo,
  getAllDoctors,
};

