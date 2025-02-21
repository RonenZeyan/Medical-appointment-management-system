const { MedicalField } = require("../models/MedicalField.Js");

/**
 * @description Add New medical field
 * @router /api/medicalfield/new-medicalfield
 * @method POST
 * @access private (only admin)
 */

const addNewMedicalField = async (req, res) => {
  try {
    //validate data

    //create new medicalField
    const new_medicalfield = new MedicalField({
      name: req.body.name,
      description: req.body.description,
    });
    await new_medicalfield.save();
    res.status(201).json({ message: "medicalField Add in successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get All MedicalFields
 * @router /api/medicalfield
 * @method GET
 * @access public
 */

const getAllMedicalFields = async (req, res) => {
  try {
    const medical_fields = await MedicalField.find();
    res.status(200).json(medical_fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Delete Exist medical field
 * @router /api/medicalfield/:medicalfield_id
 * @method DELETE
 * @access private (only admin)
 */

const DeleteMedicalField = async (req, res) => {
  try {
    //get id
    const medicalfield_id = req.params.id;

    //check if medicalfield exist
    const medical_field = await MedicalField.findById(medicalfield_id);
    if (!medical_field) {
      return res.status(404).json({ message: "Medical Field Not Exist" });
    }

    //delete the medicalfield
    await MedicalField.findByIdAndDelete(medicalfield_id);

    res
      .status(201)
      .json({ message: "medicalField Has Been Deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @description Get Specific MedicalField
 * @router /api/medicalfield/:id
 * @method GET
 * @access public
 */

const getSpecificMedicalField = async (req, res) => {
  try {
    //get id medicalField
    const id_medicalField = req.params.id;
    const medical_field = await MedicalField.findById(id_medicalField);

    if (!medical_field) {
      return res.status(404).json({ message: "Medical field dont exit" });
    }

    res.status(200).json(medical_field);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};




/**
 * @description Update specific medical field
 * @router /api/medicalfield/:id
 * @method PATCH
 * @access private (only admin)
 */

const updateMedicalField = async (req, res) => {
    try {
      const { id } = req.params; // Get the medical field ID from the URL parameters
      const updatedData = req.body; // Get the updated data from the request body
  
      // Check if the medical field exists
      const medicalField = await MedicalField.findById(id);
  
      if (!medicalField) {
        return res.status(404).json({ message: "Medical field not found" });
      }
  
      // Update specific fields (name and description)
      if (updatedData.name) medicalField.name = updatedData.name;
      if (updatedData.description) medicalField.description = updatedData.description;
      if (updatedData.doctors) medicalField.doctors = updatedData.doctors;

  
      // Save the updated medical field
      await medicalField.save();
  
      // Return the updated medical field
      res.status(200).json({
        message: "Medical field updated successfully",
        medicalField,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    }
  };



module.exports = {
  addNewMedicalField,
  getAllMedicalFields,
  DeleteMedicalField,
  getSpecificMedicalField,
  updateMedicalField
};
