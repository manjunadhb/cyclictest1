const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const app = express();

const appRouter = require("./routes/App");

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));
app.use(path.join(__dirname, "./webclient/build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./webclient/build/index.html"));
});

app.use("/", appRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// express.json() middleware is helpul for collecting values from user and assigns it to req.body
app.use(express.json());

// express.urlencoded() middlware is helpful in collecting values sent by the user and stores it in req.body
app.use(express.urlencoded());
// const connection = mysql.createConnection({
//   host: "localhost",
//   port: process.env.dbPort,
//   user: process.env.dbUser,
//   password: process.env.dbPassword,
//   database: process.env.dbName,
// });

// connection.connect((err) => {
//   if (err) {
//     console.log("Unable to connect to db");
//   } else {
//     console.log("Connected to DB Successfully");
//   }
// });

app.listen(2222, () => {
  console.log("Listening to port 2222");
});
