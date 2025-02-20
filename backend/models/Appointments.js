
const mongoose = require("mongoose");

const appointmentsSchema = new mongoose.Schema({

    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    medical_field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalField",
        required: true,
    },
    appointment_date: {
        type: Date,
        required: true,
    },
    clinic_address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Clinic",
        required:true,
    }
},
    {
        timestamps: true,
    }
);
const Appointment = mongoose.model("Appointment", appointmentsSchema);


module.exports = {
    Appointment,
}