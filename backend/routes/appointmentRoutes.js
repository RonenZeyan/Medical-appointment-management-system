const { GetSpecificAppointment, addNewAppointment, DeleteSpecificAppointment, GetallAppointments } = require("../controllers/appointmentController");
const validateObjectId = require("../middlewares/validateObjectId");
const express = require("express");
const router = express.Router();

router.get("/",GetallAppointments);
router.get("/:id", validateObjectId, GetSpecificAppointment); //get specific appointment
router.post("/new-appointment", addNewAppointment); //add new appointment
router.delete("/:id", validateObjectId, DeleteSpecificAppointment); //delete specfic appointment

module.exports = router;
