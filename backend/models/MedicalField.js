
const mongoose = require("mongoose");

const medicalFieldSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },  
    description: {
        type: String,
        trim: true,
        default:"not explained yet!"
    }, 
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[],
    }],
},
    {
        timestamps: true,
    }
);


// Fix: Prevent OverwriteModelError
const MedicalField = mongoose.models.MedicalField || mongoose.model("MedicalField", medicalFieldSchema);


module.exports = {
    MedicalField
};
