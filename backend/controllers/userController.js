const { default: mongoose } = require("mongoose");
const { MedicalField } = require("../models/MedicalField");
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * @description Get user by id
 * @router /api/users/userInfo
 * @method POST
 * @access Private (admin and user)
 */
const getUserInfo = async (req, res) => {

  try {
    // Getting id from request body
    const _id = new mongoose.Types.ObjectId(`${req.body.id}`);

    // If there any id from request body
    if (!_id) {
      return res.status(400).json({ message: "id is required" });
    }

    // Search for the user by full name (case-insensitive)
    const userFullName = await User.findOne({
      _id,
    }).select("-password"); // Exclude password from results

    // Couldn't be found user
    if (!userFullName) {
      return res.status(404).json({ message: "Couldn't be found user" });
    }

    return res.status(200).json(userFullName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get user by name
 * @router /api/users/findUser
 * @method POST
 * @access Private (admin and user)
 */
const getUserByName = async (req, res) => {
  try {
    // Getting full name from request body
    const { full_name } = req.body;

    // There is any full name from request body
    if (!full_name) {
      return res.status(400).json({ message: "User name is required" });
    }

    // Search for the user by full name (case-insensitive)
    const userFullName = await User.findOne({
      full_name,
    }).select("-password"); // Exclude password from results

    // User couldn't be found
    if (!userFullName) {
      return res.status(404).json({ message: "User couldn't be found" });
    }

    return res.status(200).json(userFullName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get user by ID
 * @router /api/users/:id
 * @method GET
 * @access Private (only admin)
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // חיפוש משתמש לפי ID
    const user = await User.findById(id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
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

    // Getting all users
    const users = await User.find().select("-password"); // Exclude passwords
    return res.status(200).json(users);
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

    // Getting full name from params
    const { id } = req.params;

    // Search and delete user
    const user = await User.findByIdAndDelete(id);

    // Check if the user was found and deleted
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
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

    // Getting full name from params
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating password directly through this route
    if (updateData.password) {
      return res
        .status(400)
        .json({ message: "Use the password update feature separately" });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    // If Couldn't be found user and update
    if (!user) {
      return res.status(404).json({ message: "Couldn't be found user and update" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get All doctors with their medical fields
 * @router /api/users/doctors
 * @method GET
 * @access Private (only admin)
 */
const getAllDoctors = async (req, res) => {
  try {
    //  Fetch all doctors (excluding password)
    const doctors = await User.find({ role: "doctor" }).select("-password");
    // If couldn't find doctors
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    //  Fetch all medical fields
    const medicalFields = await MedicalField.find();

    // Filter doctors and there medical fields
    const doctorsWithField = doctors.map((doctor) => {
      const medicalDoc = medicalFields.find((field) =>
        field.doctors.find((doc) => doc.equals(doctor._id))
      );
      return {
        _id: doctor._id,
        full_name: doctor.full_name,
        email: doctor.email,
        phone: doctor.phone,
        medicalField: medicalDoc?.name,
      };
    });

    return res.status(200).json(doctorsWithField);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get user by name
 * @router /api/users/findUser
 * @method POST
 * @access Private (only admin)
 */
const getDoctorByName = async (req, res) => {
  try {

    // Getting full name from request body
    const { full_name } = req.body;

    // If there any full name from request body
    if (!full_name) {
      return res.status(400).json({ message: "User name is required" });
    }

    // Search for a doctor by full name (case-insensitive)
    const doctor = await User.findOne({
      full_name: { $regex: new RegExp(full_name, "i") }, // Case-insensitive search
      role: "doctor", // Ensure the user is a doctor
    }).select("-password"); // Exclude password


    // Doctor could not be found
    if (!doctor) {
      return res.status(404).json({ message: "Doctor could not be found" });
    }

    // Find all medical fields
    const medicalFields = await MedicalField.find();

    // Find  and return doctors with there medical fields
    const findMedicalField = medicalFields.find((field) =>
      field.doctors.find((doc) => doc.equals(doctor._id))
    );

    return res.status(200).json({
      id: doctor._id,
      full_name: doctor.full_name,
      email: doctor.email,
      phone: doctor.phone,
      medicalField: findMedicalField.name,
    });
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
  getUserById,
  getUserInfo,
  getDoctorByName,
};
