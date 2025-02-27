const validateObjectId = require("../middlewares/validateObjectId");
const express = require("express");
const {GetallAppointments,GetExistingAppointmentOfPatient, GetSpecificAppointment, addNewAppointment, DeleteSpecificAppointment, getAvailableAppointments, getFreeTimesForAppointments } = require("../controllers/appointmentController");
const { verifyTokenIsSameUserOrAdmin, verifyTokenIsAdmin, verifyTokenIsSameUser, verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();


router.get("/free-time",getFreeTimesForAppointments);
router.get("/existing-appointment/:id",verifyTokenIsSameUserOrAdmin, GetExistingAppointmentOfPatient); //get existing appointment
router.get("/",GetallAppointments);
router.get("/:id", validateObjectId, GetSpecificAppointment); //get specific appointment
router.post("/new-appointment", addNewAppointment); //add new appointment
router.delete("/:id", validateObjectId, DeleteSpecificAppointment); //delete specfic appointment


module.exports = router;
