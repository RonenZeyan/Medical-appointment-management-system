const Clinic = require('../models/Clinics');
const { run } = require('../services/botService');
const Clinic = require("../models/Clinics");

/**
 * @description Chat With Medical Bot
 * @router /api/bot/chat
 * @method POST
 * @access private (only admin or doctor or logged in user )
 */


const chat = async (req, res) => {
    const userMessage = req.body.message;
    const userId = req.user?.id;

    if (!userMessage) {
        return res.status(400).json({ error: "❌ Please provide a message." });
    }

    try {
        // 🔹 1. שליפת כל המרפאות כולל רופאים ותחומי ההתמחות שלהם
        const clinics = await Clinic.find()
            .populate({
                path: "doctors.doctor", // שליפת הרופאים עצמם
                select: "full_name"
            })
            .populate({
                path: "doctors.medical_field", // שליפת תחום ההתמחות של כל רופא
                select: "name description"
            });

        // 🔹 2. יצירת JSON שיכיל את המידע שצריך לשלוח לבוט
        const formattedClinics = clinics.map(clinic => ({
            name: clinic.name,
            location: clinic.location,
            phone: clinic.phone,
            opening_hours: clinic.opening_hours,
            doctors: clinic.doctors.map(doctorEntry => ({
                doctor_name: doctorEntry.doctor?.full_name,
                medical_field: doctorEntry.medical_field.name,
                description: doctorEntry.medical_field.description, // תחום ההתמחות של הרופא
            }))
        }));
        // 🔹 3. קריאה לבוט עם המידע ממסד הנתונים
        const botMessage = await run(userMessage, userId, formattedClinics);

        res.json({ response: botMessage });
    } catch (error) {
        console.error("❌ Error sending to model:", error.message);
        res.status(503).json({ error: error.message });
    }
};

module.exports = {
    chat,
}