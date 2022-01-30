// const express  = require("express");
import express from 'express';
// import router from './routes/auth';
import {readdirSync} from 'fs';
import cors from 'cors';
const morgan = require('morgan');
require('dotenv').config();
import mongoose from "mongoose"

const app = express();
// Database Setup
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));


//Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json())

//Route Middleware
// fs.readdirSync('./route').map((r) => app.use('/api', require('./routes/${r}')) )
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
// app.use('/api', router);


const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
   console.log(`Server is Running on Port ${PORT}`);
})
