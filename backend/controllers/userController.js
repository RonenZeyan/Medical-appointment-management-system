const { default: mongoose } = require("mongoose");
const { MedicalField } = require("../models/MedicalField");
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * @description Get user by id
 * @router /api/user/userInfo
 * @method POST
 * @access private (admin and user)
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
 * @router /api/user/findUser
 * @method POST 
 * @access private (admin and user)
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
 * @router /api/user/:id
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
 * @router /api/user
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
 * @router /api/user/:id
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
 * @router /api/user/:id
 * @method PUT
 * @access private (only admin and user)
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
      return res
        .status(404)
        .json({ message: "Couldn't be found user and update" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get All doctors with their medical fields
 * @router /api/user/doctors
 * @method GET
 * @access private user and admin 
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
 * @description Get doctors by parameters
 * @router /api/user/findDoctor
 * @method POST
 * @access private user and admin 
 */
const getDoctorsByParameters = async (req, res) => {
  try {
    // Getting full name from request body
    const { full_name, medicalField } = req.body;

    // Search for doctors by full name (case-insensitive) or return all doctors if no full_name is provided
    const query = full_name
      ? { full_name: { $regex: new RegExp(full_name, "i") }, role: "doctor" }
      : { role: "doctor" }; // If no full_name is provided, find all doctors

    const doctors = await User.find(query).select("-password"); // Exclude password

    console.log(doctors)

    // Doctor could not be found
    if (!doctors) {
      return res.status(404).json({ message: "Doctors could not be found" });
    }

    // Find all medical fields
    const medicalFields = await MedicalField.find({
      name: { $regex: new RegExp(medicalField, "i") },
    });

    // Doctor could not be found
    if (!medicalFields) {
      return res
        .status(404)
        .json({ message: "Medical Fields could not be found" });
    }

    const doctorsWithMedicalFields = [];


    doctors.map((doctor) => {
      
      const findMedicalField = medicalFields.find((field) =>
        field.doctors.find((doc) => doc.equals(doctor._id))
      );

      if (findMedicalField || (medicalField == "" && !findMedicalField)) { // find also doctors with no medical fields
        doctorsWithMedicalFields.push({
          id: doctor._id,
          full_name: doctor.full_name,
          email: doctor.email,
          phone: doctor.phone,
          medicalField: findMedicalField?.name,
        });
      }
    });

    console.log(doctorsWithMedicalFields)

    return res.status(200).json(doctorsWithMedicalFields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Add User
 * @router /api/user/AdminAddUser
 * @method POST
 * @access private (only admin)
 */
const AddUser = async (req, res) => {
  try {
    //get email,password and name from request body
    const { full_name, email, password, phone, role } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    // Hash and Salt the password using bcrypt
    const salt = await bcrypt.genSalt(10); // 10 is the default number of rounds for bcrypt salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    user = new User({
      full_name,
      email,
      password: hashedPassword, // Store the hashed password,
      phone,
    });
    if (role) {
      user["role"] = role;
    }
    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User have been registered successfuly" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
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
  getDoctorsByParameters,
  AddUser,
};
