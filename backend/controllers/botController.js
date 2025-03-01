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
    const userId = req.user?.id

    if (!userMessage) {
        return res.status(400).json({ error: "❌ Please provide a message." });
    }
    //extract clinics + mdfields + doctors details and send to bot 

    let clinicsDetails = await Clinic.find();

    //build string include doctor and his medical fields and witch clinics he work

    try {
        const botMessage = await run(userMessage, userId);
        res.json({ response: botMessage });
    } catch (error) {
        console.error("❌ Error sending to model:", error.message);
        res.status(503).json({ error: error.message });
    }
}



module.exports = {
    chat,
}