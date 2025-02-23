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
        sunday: { start: { type: String }, end: { type: String },status: { type: String, enum: ['open', 'closed'], default: 'open' }  },
        monday: { start: { type: String }, end: { type: String },status: { type: String, enum: ['open', 'closed'], default: 'open' }  },
        tuesday: { start: { type: String }, end: { type: String },status: { type: String, enum: ['open', 'closed'], default: 'open' }  },
        wednesday: { start: { type: String }, end: { type: String },status: { type: String, enum: ['open', 'closed'], default: 'open' }  },
        thursday: { start: { type: String }, end: { type: String },status: { type: String, enum: ['open', 'closed'], default: 'open' }  },
        friday: { start: { type: String }, end: { type: String },status: { type: String, enum: ['open', 'closed'], default: 'open' }  }, 
        saturday: { start: { type: String }, end: { type: String },status: { type: String, enum: ['open', 'closed'], default: 'open' }  }
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