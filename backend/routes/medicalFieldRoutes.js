//modules imports
const express = require("express");
const { verifyTokenIsAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { getAllMedicalFields, addNewMedicalField, DeleteMedicalField, getSpecificMedicalField } = require("../controllers/medicalFieldController");
const router = express.Router();

router.get("/", getAllMedicalFields);
router.get("/:id", validateObjectId, getSpecificMedicalField);
router.post("/new-medicalfield", addNewMedicalField);
router.delete("/:id", validateObjectId, DeleteMedicalField);

module.exports = router;
