//modules imports
const express = require("express");
const { verifyTokenIsAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { getAllClinics, addNewClinic, deleteClinic, getSpecificClinic } = require("../controllers/clinicsController");
const router = express.Router();


router.get("/", getAllClinics);
router.get("/:id", getSpecificClinic);
router.post("/new-clinic", addNewClinic);
router.delete("/:id", validateObjectId, deleteClinic);

module.exports = router;
