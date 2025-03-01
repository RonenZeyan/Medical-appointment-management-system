
const express = require("express");
const connectToDB = require("./config/connectToDB");
const cors = require("cors");
require("dotenv").config();

connectToDB(); //connec to mongodb 
const app = express();
app.use(express.json());
app.use(cors());


//import routes 
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const clinicsRoutes = require("./routes/clinicsRoutes");
const medicalFieldRoutes = require("./routes/medicalFieldRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const botRoutes = require("./routes/botRoutes");
const { notFound, errorHandler } = require("./middlewares/error");
const contactRoutes = require("./routes/contactRoutes");


//use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/medicalfield",medicalFieldRoutes);
app.use("/api/clinic",clinicsRoutes);
app.use("/api/appointment",appointmentRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/chat",botRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api', contactRoutes);


//in case send Route and not Founded in every Route then send notFound error and also handle errors in case not a page 
app.use(notFound);
app.use(errorHandler);


//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});