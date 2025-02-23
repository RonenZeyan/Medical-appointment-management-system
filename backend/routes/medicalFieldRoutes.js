//modules imports
const express = require("express");
const { verifyTokenIsAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { addNewMedicalField, DeleteMedicalField, getAllMedicalFields } = require("../controllers/medicalFieldController");
const router = express.Router();

router.get("/", getAllMedicalFields);
router.post("/new-medicalfield", verifyTokenIsAdmin, addNewMedicalField);
router.delete("/:id", validateObjectId, verifyTokenIsAdmin, DeleteMedicalField);

module.exports = router;
