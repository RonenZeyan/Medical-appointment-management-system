const { default: mongoose } = require("mongoose");
const { Appointment } = require("../models/Appointments");
const Clinic = require("../models/Clinics");
const { MedicalField } = require("../models/MedicalField");

const { User } = require("../models/User");

/**
 * @description Create New Appointment
 * @router /api/appointment/new-appointment
 * @method POST
 * @access private (only logged in user or doctor or admin)
 */
const addNewAppointment = async (req, res) => {
  try {
    //validate data getten in req

    // //check if user exist (by unique email)
    // let user = await User.findOne({ email: req.body.email });
    // if (!user) {
    //     return res.status(400).json({ message: "Email or Password Invalid" })
    // }

    //create new appointment
    const new_appointment = await Appointment({
      patient_id: req.body.patient_id,
      doctor: req.body.doctor,
      medical_field: req.body.medical_field,
      appointment_date: req.body.appointment_date,
      clinic_address: req.body.clinic_address,
    });

    await new_appointment.save();
    res
      .status(201)
      .json({ message: "Appointment Created successfully!", new_appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @description Get Specific Appointment
 * @router /api/appointment/:id
 * @method GET
 * @access private (only logged in user or doctor or admin)
 */
const GetSpecificAppointment = async (req, res) => {
  try {
    // //check if appointment exist
    let exist_appointment = await Appointment.findById(req.params.id)
      .populate("patient_id", "full_name")
      .populate("doctor", "full_name")
      .populate("medical_field", "name")
      .populate("clinic_address", "name location");
    if (!exist_appointment) {
      return res.status(400).json({ message: "appointment Not Exist" });
    }

    res.status(200).json(exist_appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @description Delete Specific Appointment
 * @router /api/appointment/:id
 * @method DELETE
 * @access private (only logged in user or doctor or admin)
 */
const DeleteSpecificAppointment = async (req, res) => {
  try {
    // //check if user exist (by unique email)
    let exist_appointment = await Appointment.findById(req.params.id);
    if (!exist_appointment) {
      return res.status(400).json({ message: "appointment Not Exist" });
    }

    //delete the appointment
    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Appointment Has Been Deleted Successfully!",
      exist_appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @description Delete Specific Appointment
 * @router /api/appointment/:id
 * @method PUT
 * @access private (only logged in user or doctor or admin)
 */
const updateAppointmentStatus = async (req, res) => {
  try {
      const { id } = req.params; // מזהה התור
      const updatedAppointment = await Appointment.findByIdAndUpdate(
          id, 
          { appointment_status: "cancelled" }, 
          { new: true } // מחזיר את המסמך המעודכן
      );

      if (!updatedAppointment) {
          return res.status(404).json({ message: "Appointment not found" });
      }

      return res.status(200).json(updatedAppointment);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
  }
};


/**
 * @description Get all Appointments
 * @router /api/appointment
 * @method GET
 * @access private (only logged in user or doctor or admin)
 */
const GetallAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    //if there is query then get by query and not all appointments 
    const filter = status ? { appointment_status: status } : {};
    let allAppointments = await Appointment.find(filter);
    
    if (status) {
      allAppointments = await Appointment.find(filter)
        .populate("patient_id")
        .populate("doctor")
        .populate("medical_field")
        .populate("clinic_address");
    }

    return res.status(200).json(allAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


/**
 * @description Get Existing Appointments for a specific patient
 * @router /api/appointment
 * @method GET
 * @access private (only logged-in user, doctor, or admin)
 */
const GetExistingAppointmentOfPatient = async (req, res) => {
  try {
    // const patientId = req.user.id;

    const patientId = new mongoose.Types.ObjectId(`${req.user.id}`);

    // find appointment by patient id
    const checkPatient = await Appointment.findOne({
      patient_id: patientId,
    });

    if (!checkPatient) {
      return res
        .status(404)
        .json({ message: "Patient not found in appointments" });
    }

    return res.status(200).json(checkPatient);
  } catch (err) {
    console.error("Error fetching patient:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


/**
 * @description Get Free Time that user can choose to create a appointments in specific day
 * @router /api/appointment/free-time
 * @method GET
 * @access private (only logged-in user, doctor, or admin)
 */
const getFreeTimesForAppointments = async (req, res) => {
  try {
    const { date, doctorId, clinic } = req.query;

    // בדיקה שכל הפרמטרים קיימים
    if (!date || !doctorId || !clinic) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // בדיקה שהתאריך בפורמט חוקי
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const specific_clinic = await Clinic.findById(clinic);

    // בדיקה שהקליניקה קיימת
    if (!specific_clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const dayOfWeek = appointmentDate.getDay();
    const opening_time_day = specific_clinic.opening_hours[daysOfWeek[dayOfWeek]];

    let time_arr = [];

    if (opening_time_day.status === "open") {
      time_arr = generateTimeSlots(opening_time_day.start, opening_time_day.end);
    }

    // מציאת התורים שכבר קיימים באותו יום ואצל אותו רופא
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      clinic_address: clinic,
      appointment_status: "existing",
      appointment_date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)), // תחילת היום
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999)) // סוף היום
      }
    });

    // חילוץ השעות של התורים הקיימים
    const takenTimes = existingAppointments.map(app => {
      const hours = app.appointment_date.getHours().toString().padStart(2, '0');
      const minutes = app.appointment_date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    // סינון השעות הפנויות - השארת רק שעות שלא תפוסות
    time_arr = time_arr.filter(time => !takenTimes.includes(time));

    res.status(200).json({ availableTimes: time_arr });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};




function generateTimeSlots(start, end) {
  const slots = [];
  let [startHour, startMinute] = start.split(':').map(Number);
  let [endHour, endMinute] = end.split(':').map(Number);

  while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
    // הוספת הזמן הנוכחי למערך
    slots.push(`${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`);

    // הוספת 30 דקות
    startMinute += 30;
    if (startMinute >= 60) {
      startMinute = 0;
      startHour += 1;
    }
  }

  return slots;
}

/**
 * @description Get Today's and Future Appointments (after the current time)
 * @router /api/appointment/today-and-future
 * @method GET
 * @access private (only logged in user, doctor, or admin)
 */
const getTodaysAndFutureAppointments = async (req, res) => {
  try {
    const currentDate = new Date();

    // חיפוש תורים עתידיים
    const appointments = await Appointment.find({
      appointment_date: {
        $gte: currentDate,  // רק תורים עם תאריך עתידי או היום
      },
      appointment_status: "existing",
    })
      .populate("patient_id")  // מביאים את תעודת הזהות של המטופל
      .populate("doctor")  // מביאים את תעודת הזהות של הרופא
      .populate("clinic_address");  // מביאים את כתובת המרפאה
      console.log(appointments); // הדפס את התוצאה כדי לבדוק את הערכים


    // מחזירים את התורים העתידיים
    const result = appointments.map(appointment => {
      if (!appointment.patient_id || !appointment.doctor) {
        return null; // או החזר אובייקט ריק במקרה של נתונים חסרים
      }
    
      const patientId = appointment.patient_id ? appointment.patient_id.id : null;
      const doctorId = appointment.doctor ? appointment.doctor.id : null;
    
      return {
        patientId: patientId,
        doctorId: doctorId,
        appointmentDate: appointment.appointment_date,
      };
    }).filter(appointment => appointment !== null);  // מסנן את התורים שאין להם מידע
    

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "משהו השתבש" });
  }
};



module.exports = {
  addNewAppointment,
  GetSpecificAppointment,
  DeleteSpecificAppointment,
  GetallAppointments,
  GetExistingAppointmentOfPatient,
  getFreeTimesForAppointments,
  updateAppointmentStatus,
  getTodaysAndFutureAppointments,
};

