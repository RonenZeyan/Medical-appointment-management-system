
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


  module.exports = {
    getAllDoctors,
  }