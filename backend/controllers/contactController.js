const Contact = require("../models/Contact");

// קבלת כל הפניות
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving contacts." });
    }
};

// יצירת פניה חדשה
const createContact = async (req, res) => {
    const { email, phone, subject, message } = req.body;
    try {
        const newContact = new Contact({
            email,
            phone,
            subject,
            message,
        });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: "Error creating contact." });
    }
};

// עדכון סטטוס פניה
const updateContactStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: "Error updating contact status." });
    }
};

// מחיקת פניה
const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: "Contact deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting contact." });
    }
};

// השבת לפנייה
const replyToContact = async (req, res) => {
    const { id } = req.params;  // מזהה הפנייה
    const { reply } = req.body;  // התגובה שהוזנה

    try {
        const contact = await Contact.findByIdAndUpdate(
            id, 
            { reply },  // עדכון התגובה
            { new: true }  // מחזיר את הפנייה המעודכנת
        );

        if (!contact) {
            return res.status(404).json({ message: "Contact not found." });
        }

        res.status(200).json(contact);  // מחזיר את הפנייה עם התגובה
    } catch (error) {
        res.status(500).json({ message: "Error replying to contact." });
    }
};


// קבלת כל הפניות של משתמש לפי המייל
const getUserContacts = async (req, res) => {
    const { email } = req.params;  // קבלת המייל מהבקשה
    try {
        // סינון הפניות לפי המייל
        const contacts = await Contact.find({ email: email });
        res.status(200).json(contacts);  // מחזיר את הפניות כ-JSON
    } catch (error) {
        res.status(500).json({ message: "Error retrieving contacts." });
    }
};

module.exports = {
    getAllContacts,
    createContact,
    updateContactStatus,
    deleteContact,
    replyToContact,
    getUserContacts
};