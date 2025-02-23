const { Appointment } = require("../models/Appointments");
const Clinic = require("../models/Clinics");
const { MedicalField } = require("../models/MedicalField.Js");
const { User } = require("../models/User");



/**
 * @description Get Number of Clinics,Users,doctors,medicalFields
 * @router /api/dashboard/general-num
 * @method GET
 * @access private (only admin)
 */

const getDashboardDataNumber = async (req, res) => {
    try {
        const clinicCount = await Clinic.countDocuments();
        const userCount = await User.countDocuments();
        const medicalFieldCount = await MedicalField.countDocuments();
        const doctorsCount = await User.find({role:"doctor"}).countDocuments();

        res.status(200).json({
            clinics: clinicCount,
            users: userCount,
            medical_fields: medicalFieldCount,
            doctors: doctorsCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong!" });
    }
};


module.exports = {
    getDashboardDataNumber,
}