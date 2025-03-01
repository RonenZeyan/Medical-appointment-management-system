const express = require("express");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenIsSameUserOrAdmin, verifyTokenIsAdmin, verifyTokenIsSameUser, verifyToken } = require("../middlewares/verifyToken");
const {
    GetallAppointments,
    GetExistingAppointmentOfPatient,
    GetSpecificAppointment,
    addNewAppointment,
    updateAppointmentStatus,
    DeleteSpecificAppointment,
    getDoctorAppointments,
    markAppointmentAsCompleted,
    cancelAppointment,
    bookAppointment,
    getAvailableAppointments,
    getFreeTimesForAppointments,
  getTodaysAndFutureAppointments,
} = require("../controllers/appointmentController");

const router = express.Router();



router.get("/existing-appointment/:id", verifyTokenIsSameUserOrAdmin, GetExistingAppointmentOfPatient);
router.get("/", GetallAppointments);
router.get("/:id", validateObjectId, GetSpecificAppointment); //get specific appointment
router.post("/new-appointment", addNewAppointment); //add new appointment
router.delete("/:id", validateObjectId, DeleteSpecificAppointment); //delete specfic appointment
router.get("/free-time", getFreeTimesForAppointments);
router.get("/doctor", getDoctorAppointments);
router.patch("/complete/:id", markAppointmentAsCompleted);
router.delete("/cancel/:id", cancelAppointment);
router.post("/book", bookAppointment);
router.get("/future-appointments", verifyTokenIsAdmin, getTodaysAndFutureAppointments);  // רק מנהל יכול לגשת לזה
router.patch("/:id",updateAppointmentStatus);


module.exports = router;

