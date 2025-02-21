const { GetSpecificAppointment, addNewAppointment, DeleteSpecificAppointment } = require("../controllers/appointmentController");
const validateObjectId = require("../middlewares/validateObjectId");
const express = require("express");
const {GetExistingAppointmentOfPatient, GetSpecificAppointment, addNewAppointment, DeleteSpecificAppointment, getAvailableAppointments } = require("../controllers/appointmentController");
const { verifyTokenIsSameUserOrAdmin, verifyTokenIsAdmin, verifyTokenIsSameUser, verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();




router.get("/existing-appointment/:id",verifyTokenIsSameUserOrAdmin, GetExistingAppointmentOfPatient); //get existing appointment
router.get("/:id", validateObjectId, GetSpecificAppointment); //get specific appointment
router.post("/new-appointment", addNewAppointment); //add new appointment
router.delete("/:id", validateObjectId, DeleteSpecificAppointment); //delete specfic appointment


module.exports = router;
