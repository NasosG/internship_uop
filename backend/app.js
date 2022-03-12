const express = require("express");
const studentRoutes = require("./api-routes/studentRoutes.js");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
// for atlas login
const axios = require("axios");
const bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(express.json());
// app.use(cors());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (request, response) => {
  response.send("<h2>hello from the server!</h2>");
});

app.use("/api/students", studentRoutes);

const storageSsn = multer.diskStorage({
  destination: "./uploads/ssns",
  filename: function (request, file, cb) {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  }
});

const storageIban = multer.diskStorage({
  destination: "./uploads/ibans",
  filename: function (request, file, cb) {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  }
});

const uploadSsn = multer({
  storage: storageSsn,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg" && ext !== ".pdf" && ext !== ".webp") {
      return callback(new Error("This file type is not valid"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 244140625
  }
});

const uploadIban = multer({
  storage: storageIban,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg" && ext !== ".pdf" && ext !== ".webp") {
      return callback(new Error("This file type is not valid"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 244140625
  }
});

app.post(
  "/api/students/updateStudentSSNFile/:id", uploadSsn.single("file"), (request, response) => {
    console.log("FILE ADDED SSN");
  }
);

app.post(
  "/api/students/updateStudentIbanFile/:id", uploadIban.single("file"), (request, response) => {
    console.log("FILE ADDED IBAN");
  }
);

app.post("/api/students/login/:id", (request, response, next) => {
  const fetchedId = request.params.id;
  const token = jwt.sign({
      userId: fetchedId
    },
    "secret_this_should_be_longer", {
      expiresIn: "1h"
    }
  );
  response.status(200).json({
    token: token,
    expiresIn: 3600,
    userId: fetchedId
  });
});

// test pilot atlas login
app.post('/atlas/login', async (req, res) => {
  const myData = JSON.stringify(req.body);
  console.log(myData);
  try {

    const resp = await axios({
      url: 'http://studentpractice.pilotiko.gr/Api/Offices/v1/Login',
      method: 'POST',
      data: myData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      message: resp.data,
      status: resp.status
    });
  } catch (error) {
    if (error.response.status !== 200) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);

      return res.status(400).json({
        type: error.response.data,
        status: error.response.status
      });

    } else if (error.request.status !== 200) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
      console.log("2");
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  }
});


module.exports = app;
