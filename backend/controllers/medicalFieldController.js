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
