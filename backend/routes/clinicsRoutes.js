//modules imports
const express = require("express");
const { verifyTokenIsAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { getAllClinics, addNewClinic, deleteClinic, getSpecificClinic,getSpecificClinicByName,updateClinic } = require("../controllers/clinicsController");
const router = express.Router();


router.get("/", getAllClinics);

router.post("/new-clinic", verifyTokenIsAdmin, addNewClinic);
router.post("/find-by-name", getSpecificClinicByName);
router.delete("/:id", validateObjectId, verifyTokenIsAdmin, deleteClinic);
router.get("/:id", getSpecificClinic);
router.put("/:id",validateObjectId,updateClinic);

module.exports = router;
