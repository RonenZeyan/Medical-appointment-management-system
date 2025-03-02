const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "לא נקרא" },
    createdAt: { type: Date, default: Date.now },
    reply: { type: String, default: "" },  // שדה חדש עבור התגובה

});


const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
