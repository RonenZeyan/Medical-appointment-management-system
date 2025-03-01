const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");


//מציג את כל הפניות 
router.get("/contacts", contactController.getAllContacts);
//מוסיף פניה
router.post("/", contactController.createContact);
//מעדכן את הסטטוס
router.put("/:id", contactController.updateContactStatus);
//מוחק פניה
router.delete("/:id", contactController.deleteContact);
//השבה לפנהי
router.put('/reply/:id', contactController.replyToContact);
//מציג את התגובה 
// route שמחזיר את כל הפניות של משתמש לפי המייל
router.get("/contacts/user/:email",contactController.getUserContacts);



module.exports = router;
