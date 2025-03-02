const bcrypt = require("bcryptjs");
const { User} = require("../models/User");
const { registerValidation } = require("../validations/userValidation");


/**
 * @description Login User
 * @router /api/auth/login
 * @method POST
 * @access public
 */

const loginUser = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token using the method defined in the User model
    const token = user.generateAuthToken();

    let connectedUser = {
      full_name: user.full_name,
      email: user.email,
      id: user._id,
      role: user.role,
    };

    return res.status(200).json({
      token,
      connectedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
};

/**
 * @description Register User
 * @router /api/auth/register
 * @method POST
 * @access public
 */

const registerUser = async (req, res) => {
  try {
    // Get email,password and name from request body
    const { full_name, email, password, phone } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    // Run validation before proceeding
    const validationResponse = registerValidation({ full_name, email, password, phone });
    if (validationResponse.error) {
      return res.status(400).json({ message: validationResponse.error });
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

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User have been registered successfuly" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
};




/**
 * @description Change Password
 * @router PATCH /api/auth/change-password/:id
 * @access Private (Authenticated User)
 */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.params.id;

    // Find user by ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password with stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
   // Run validation before proceeding
   const validationResponse = registerValidation({newPassword });
   if (validationResponse.error) {
     return res.status(400).json({ message: validationResponse.error });
   }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save updated password
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
};


module.exports = {
  loginUser,
  registerUser,
  changePassword
};
