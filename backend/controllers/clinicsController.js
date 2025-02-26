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
      opening_hours:req.body.opening_hours,
      doctors: req.body.doctors,
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

/**
 * @description update Clinic
 * @router /api/clinic/:id
 * @method PATCH
 * @access private (only admin)
 */

const updateClinic = async (req, res) => {
  try {
    //get id
    const clinic_id = req.params.id;
    const updatedData = req.body; // Get the updated clinic data from the request body

    const clinic = await Clinic.findByIdAndUpdate(clinic_id, updatedData, {
      new: true,
    });

    if (!clinic) {
      return res.status(404).json({ message: "Clinit not found!" });
    }

    return res.status(200).json(clinic);
  } catch {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get specific clinic
 * @router /api/clinic/:id
 * @method GET
 * @access public
 */

const getSpecificClinic = async (req, res) => {
  try {
    //get id
    const clinic_id = req.params.id;
    const clinic = await Clinic.findById(clinic_id)
    .populate(
      {
        path: "doctors.doctor", //populate for doctor in doctors array
        select: "full_name" //get just one fields 
      }
    )
    .populate(
      {
        path: "doctors.medical_field", //populate for doctor in doctors array
        select: "name" //get just one fields 
      }
    );

    if (!clinic) {
      return res.status(404).json({ message: "Clinic Not Exist" });
    }

    res.status(200).json(clinic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};



/**
 * @description Get specific clinic by name
 * @router /api/clinic/search
 * @method POST
 * @access public
 */

const getSpecificClinicByName = async (req, res) => {


    try {
      // Get the clinic name from the request body
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: "Clinic name is required" });
      }
  
      // Search for the clinic by name using a case-insensitive match
      const clinic = await Clinic.findOne({
        name: { $regex: new RegExp(name, "i") }, // 'i' for case-insensitive search
      });
  
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
  
      // Return the clinic data
      res.status(200).json(clinic);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    }
  };

  


module.exports = {
  addNewClinic,
  getAllClinics,
  deleteClinic,
  updateClinic,
  getSpecificClinic,
  getSpecificClinicByName
};

