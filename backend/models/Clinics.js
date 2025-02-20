const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location:
    {
        city: {
            type: String,
            required: true
        },
        region: {
            type: String,
            enum: ["צפון", "דרום", "מרכז"],
            required: true
        },
        address: {
            type: String,
            required: true
        },
    },
    phone: {
        type: String,
        required: true,
    },
    opening_hours: {
        sunday: { start: { type: Date }, end: { type: Date } },
        monday: { start: { type: Date }, end: { type: Date } },
        tuesday: { start: { type: Date }, end: { type: Date } },
        wednesday: { start: { type: Date }, end: { type: Date } },
        thursday: { start: { type: Date }, end: { type: Date } },
        friday: { start: { type: Date }, end: { type: Date } }, 
        saturday: { start: { type: Date }, end: { type: Date } }
    },
    doctors: [{
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        medical_field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalField",
            required: true
        }
    }]
},
    {
        timestamps: true,
    }
);

const Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;