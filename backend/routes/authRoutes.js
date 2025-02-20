//modules imports 
const express = require("express");
const { User, registerValidation } = require("../models/User");
const bcrypt = require("bcryptjs")
const router = express.Router();


/**
 * @description Register New User
 * @router /api/auth/register
 * @method POST
 * @access public
 */
const registerUser = async (req, res) => {
    try {
        //validate data getten in req
        const validationResult = registerValidation(req.body);
        if(validationResult.error){
            return res.status(400).json({message:validationResult.error})
        }

        //check if user already registered
        let existing_user = await User.findOne({ email: req.body.email })
        if (existing_user) {
            return res.status(400).json({ message: "User Already Exist" })
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //save To db
        const new_user = new User({
            email: req.body.email,
            full_name: req.body.full_name,
            password: hashedPassword,
        });
        await new_user.save()

        res.status(201).json({ message: "User Registered Successfully,Please SignIn" });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


/**
 * @description Login User
 * @router /api/auth/login
 * @method POST
 * @access public
 */
const loginUser = async (req, res) => {
    try {
        //validate data getten in req

        //check if user exist (by unique email)
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "Email or Password Invalid" })
        }

        //compare hashed the password with sended password
        const is_password_correct = await bcrypt.compare(req.body.password, user.password);
        if (!is_password_correct) {
            return res.status(400).json({ message: "Email or Password Invalid" })
        }

        //generate Token
        const token = user.generateAuthToken();

        //get all fields of user without password
        const {password,...other_fields_user} = user._doc;

        //return response to client/frontEnd (object include user data and token)
        res.status(201).json({...other_fields_user,token})

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


router.post("/register", registerUser);
router.post("/login", loginUser);


module.exports = router;
