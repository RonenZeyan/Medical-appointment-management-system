const Clinic = require("../models/Clinics");

/**
 * @description Add New Clinic
 * @router /api/clinic/new-clinic
 * @method POST
 * @access private (only admin)
 */

const addNewClinic = async (req, res) => {
  try {
    //validate data

    //create new clinic
    const new_clinic = new Clinic({
      name: req.body.name,
      location: req.body.location,
      phone: req.body.phone,
      medical_fields: req.body.medical_fields,
    });
    await new_clinic.save();
    res.status(201).json({ message: "Clinic Add in successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get All clinics
 * @router /api/clinic
 * @method GET
 * @access public
 */

const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.status(200).json(clinics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description delete Clinic
 * @router /api/clinic
 * @method DELETE
 * @access private (only admin)
 */

const deleteClinic = async (req, res) => {
  try {
    //get id
    const clinic_id = req.params.id;

    //check if clinic exist
    const clinic = await Clinic.findById(clinic_id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic Not Exist" });
    }

    //delete the clinic
    await Clinic.findByIdAndDelete(clinic_id);

    res.status(201).json({ message: "clinic Has Been Deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
