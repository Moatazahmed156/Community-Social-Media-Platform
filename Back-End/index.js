require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/db");


const app = express();
app.use(express.json());

dbConnect();



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});