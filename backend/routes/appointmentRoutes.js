const express = require("express");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenIsSameUserOrAdmin, verifyTokenIsAdmin, verifyTokenIsSameUser, verifyToken } = require("../middlewares/verifyToken");
const {
    GetallAppointments,
    GetExistingAppointmentOfPatient,
    GetSpecificAppointment,
    addNewAppointment,
    DeleteSpecificAppointment,
    getDoctorAppointments,
    markAppointmentAsCompleted,
    cancelAppointment,
    bookAppointment,
    getAvailableAppointments,
    getFreeTimesForAppointments
} = require("../controllers/appointmentController");

const router = express.Router();


router.get("/existing-appointment/:id", verifyTokenIsSameUserOrAdmin, GetExistingAppointmentOfPatient);
router.get("/", GetallAppointments);
router.get("/:id", validateObjectId, GetSpecificAppointment);
router.post("/new-appointment", addNewAppointment);
router.delete("/:id", validateObjectId, DeleteSpecificAppointment);
router.get("/free-time", getFreeTimesForAppointments);
router.get("/doctor", getDoctorAppointments);
router.patch("/complete/:id", markAppointmentAsCompleted);
router.delete("/cancel/:id", cancelAppointment);
router.post("/book", bookAppointment);

module.exports = router;