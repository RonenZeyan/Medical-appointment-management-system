//modules imports
const express = require("express");
const { verifyTokenIsAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { getAllClinics, addNewClinic, deleteClinic } = require("../controllers/clinicsController");
const router = express.Router();


router.get("/", getAllClinics);
router.post("/new-clinic", verifyTokenIsAdmin, addNewClinic);
router.delete("/:id", validateObjectId, verifyTokenIsAdmin, deleteClinic);

module.exports = router;
