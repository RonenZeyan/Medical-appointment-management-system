
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
            required: true,
            trim:true,
            minLength:7,
            maxLength: 20

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


const registerValidation = (user_data) => {
    let errors = [];

    //check email
    if (!validator.isEmail(user_data.email)) {
        errors.push("אימייל לא תקין!");
    }

    //check if email length between 5 - 100
    if (!validator.isLength(user_data.email, { min: 5, max: 100 })) {
        errors.push("אימייל צריך להיות בין 5 עד 100 תווים");
    }

    //check if full name length between 5 - 200
    if (!validator.isLength(user_data.full_name, { min: 5, max: 200 })) {
        errors.push("שם צריך להיות בין 5 עד 200 תווים");
    }

    // //check if password is strong enough by check that it include min 8 chars and at least 1 number and at least 1 uppercase 
    // if (!validator.isStrongPassword(user_data.password, { minLength: 8, minNumbers: 1, minUppercase: 1 })) {
    //     errors.push("הסיסמה חייבת להכיל לפחות 8 תווים, כולל מספר ואות גדולה");
    // }

    // if (!["patient", "doctor", "admin"].includes(user_data.role)) {
    //     errors.push("תפקיד לא תקף");
    // }

    return errors.length>0 ? {error:errors} : {success:true};
};

module.exports = {
    User,
    registerValidation,
}