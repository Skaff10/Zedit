const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const port = process.env.PORT;
const connectDB = require("./config/db");

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/docs", require("./routes/docRoutes"));
app.use("/api/boards", require("./routes/boardRoutes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.green);
});
