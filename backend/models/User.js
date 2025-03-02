
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator")


const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 100,
            unique: true,
        },
        full_name: {
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 200,
        },
        phone:{
            type:String,
            required:true,
            trim:true,
            minLength:7,
            maxLength:20,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8,
        },
        role: {
            type: String,
            enum: ["patient", "doctor", "admin"],
            default: "patient",
        }
    },
    {
        timestamps: true,
    }
);

//generate Token 
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET_KEY);
}

const User = mongoose.model("User", userSchema);


module.exports = {
    User,
}