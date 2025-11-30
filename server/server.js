const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const port = process.env.PORT ;
const connectDB = require("./config/db");

connectDB();
const app = express();


app.listen(port, () => {
    console.log(`Server is running on port ${port}`.green);
});
