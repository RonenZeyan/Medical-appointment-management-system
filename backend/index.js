
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

//use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/medicalfield",medicalFieldRoutes);
app.use("/api/clinic",clinicsRoutes);
app.use("/api/appointment",appointmentRoutes);


//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});