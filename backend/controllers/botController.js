const { run } = require('../services/botService');
const Clinic = require("../models/Clinics");
const ChatLog = require("../models/chatLogs");
const mongoose = require("mongoose");

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
                doctor_name: doctorEntry.doctor.full_name,
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


/**
 * @description Get Chat History of a Specific User
 * @router /api/bot/history
 * @method GET
 * @access private (only admin, doctor, or logged-in user)
 */

const getChatHistory = async (req, res) => {
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(400).json({ error: "❌ User ID is required." });
    }

    try {
        const objectId = new mongoose.Types.ObjectId(user_id);
        // 🔹 חיפוש כל היסטוריית השיחות של המשתמש לפי user_id

        const chatHistory = await ChatLog.find({ userId: objectId, }).sort({ createdAt: -1 });
        if (!chatHistory || chatHistory.length === 0) {
            return res.status(404).json({ message: "📭 No chat history found for this user." });
        }

        res.json({ chatHistory: chatHistory });
    } catch (error) {
        console.error("❌ Error fetching chat history:", error.message);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

module.exports = {
    chat,
    getChatHistory,
}