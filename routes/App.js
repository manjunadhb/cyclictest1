const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcrypt");

require("dotenv").config();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: "localhost",
  port: process.env.dbPort,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database: process.env.dbName,
});

connection.connect((err) => {
  if (err) {
    console.log("Unable to connect to db");
  } else {
    console.log("Connected to DB Successfully");
  }
});

router.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  let sqlQuery = `insert into Users (firstName,lastName,email,password,mobileNo,gender,maritalStatus,profilePic) values ('${req.body.fn}','${req.body.ln}','${req.body.email}','${hashedPassword}','${req.body.mobileNo}','${req.body.gender}','${req.body.maritalStatus}','${req.file.path}')`;

  console.log(sqlQuery);

  connection.query(sqlQuery, (error, result, fields) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ status: "User successfully created" });
    }
  });
});

router.patch("/updateUser", upload.single("profilePic"), (req, res) => {
  let sqlQuery = `update Users set firstName='${req.body.fn}',lastName='${req.body.ln}',email='${req.body.email}',password='${req.body.password}',mobileNo='${req.body.mobileNo}',profilePic='${req.file.path}',gender='${req.body.gender}',maritalStatus='${req.body.maritalStatus}' where id=${req.body.id}`;

  console.log(sqlQuery);

  connection.query(sqlQuery, (error, results, fields) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

router.put("/updateUser", upload.single("profilePic"), (req, res) => {
  let sqlQuery = `update Users set firstName='${req.body.fn}',lastName='${req.body.ln}',email='${req.body.email}',password='${req.body.password}',mobileNo='${req.body.mobileNo}',profilePic='${req.file.path}',gender='${req.body.gender}',maritalStatus='${req.body.maritalStatus}' where id=${req.body.id}`;

  console.log(sqlQuery);

  connection.query(sqlQuery, (error, results, fields) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

router.post("/validateCredentials", (req, res) => {
  console.log(req.body);

  let sqlQuery = `select * from Users where email='${req.body.email}'`;

  console.log(sqlQuery);

  connection.query(sqlQuery, async (error, results, fields) => {
    if (error) {
      res.json(error);
    } else {
      console.log(results);

      if (results.length > 0) {
        let isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          results[0]["password"]
        );

        if (isPasswordCorrect == true) {
          res.json({
            loggedIn: true,
            id: results[0]["id"],
            firstName: results[0]["firstName"],
            lastName: results[0]["lastName"],
            email: results[0]["email"],
            gender: results[0]["gender"],
            maritalStatus: results[0]["maritalStatus"],
            mobileNo: results[0]["mobileNo"],
            profilePic: results[0]["profilePic"],
            status: "Successfully logged in",
          });
        } else {
          res.json({
            loggedIn: false,
            status: "Invalid Password",
          });
        }
      } else {
        res.json({
          loggedIn: false,
          status: "User doesn't exist",
        });
      }
    }
  });
});

router.delete("/deleteUser", (req, res) => {
  let sqlQuery = `delete from Users where id=${req.query.id}`;

  console.log(sqlQuery);

  connection.query(sqlQuery, (error, results, fields) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ status: "User Deleted Successfully" });
    }
  });
});

router.get("/usersList", (req, res) => {
  let sqlQuery = `select id,firstName,lastName,email,gender,maritalStatus,mobileNo,password from Users`;

  connection.query(sqlQuery, (error, results, fields) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
