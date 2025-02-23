const { default: mongoose } = require("mongoose");
const { Appointment } = require("../models/Appointments");
const Clinic = require("../models/Clinics");
const { MedicalField } = require("../models/MedicalField");

const { User } = require("../models/User");

/**
 * @description Create New Appointment
 * @router /api/appointment/new-appointment
 * @method POST
 * @access private (only logged in user or doctor or admin)
 */
const addNewAppointment = async (req, res) => {
  try {
    //validate data getten in req

    // //check if user exist (by unique email)
    // let user = await User.findOne({ email: req.body.email });
    // if (!user) {
    //     return res.status(400).json({ message: "Email or Password Invalid" })
    // }

    //create new appointment
    const new_appointment = await Appointment({
      patient_id: req.body.patient_id,
      doctor: req.body.doctor,
      medical_field: req.body.medical_field,
      appointment_date: req.body.appointment_date,
      clinic_address: req.body.clinic_address,
    });

    await new_appointment.save();
    res
      .status(201)
      .json({ message: "Appointment Created successfully!", new_appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @description Get Specific Appointment
 * @router /api/appointment/:id
 * @method GET
 * @access private (only logged in user or doctor or admin)
 */
const GetSpecificAppointment = async (req, res) => {
  try {
    // //check if appointment exist
    let exist_appointment = await Appointment.findById(req.params.id)
      .populate("patient_id", "full_name")
      .populate("doctor", "full_name")
      .populate("medical_field", "name")
      .populate("clinic_address", "name location");
    if (!exist_appointment) {
      return res.status(400).json({ message: "appointment Not Exist" });
    }

    res.status(200).json(exist_appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @description Delete Specific Appointment
 * @router /api/appointment/:id
 * @method DELETE
 * @access private (only logged in user or doctor or admin)
 */
const DeleteSpecificAppointment = async (req, res) => {
  try {
    // //check if user exist (by unique email)
    let exist_appointment = await Appointment.findById(req.params.id);
    if (!exist_appointment) {
      return res.status(400).json({ message: "appointment Not Exist" });
    }

    //delete the appointment
    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Appointment Has Been Deleted Successfully!",
      exist_appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @description Get all Appointments
 * @router /api/appointment
 * @method GET
 * @access private (only logged in user or doctor or admin)
 */
const GetallAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointment.find();

    return res.status(200).json(allAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


/**
 * @description Get Existing Appointments for a specific patient
 * @router /api/appointment
 * @method GET
 * @access private (only logged-in user, doctor, or admin)
 */
const GetExistingAppointmentOfPatient = async (req, res) => {
  try {
    // const patientId = req.user.id;

    const patientId = new mongoose.Types.ObjectId(`${req.user.id}`);

    // find appointment by patient id
    const checkPatient = await Appointment.findOne({
      patient_id: patientId,
    });

    if (!checkPatient) {
      return res
        .status(404)
        .json({ message: "Patient not found in appointments" });
    }

    return res.status(200).json(checkPatient);
  } catch (err) {
    console.error("Error fetching patient:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports = {
  addNewAppointment,
  GetSpecificAppointment,
  DeleteSpecificAppointment,
  GetallAppointments,
  GetExistingAppointmentOfPatient,
};

