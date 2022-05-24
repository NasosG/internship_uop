// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
// const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

// Route imports
const studentRoutes = require("./api-routes/studentRoutes.js");
const atlasRoutes = require("./api-routes/atlasRoutes.js");
const depManagerRoutes = require("./api-routes/depManagerRoutes.js");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

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
app.use("/api/atlas", atlasRoutes);
app.use("/api/depmanager", depManagerRoutes);

// app.post(
//   "/api/students/updateStudentSSNFile/:id", upload.ssn, (request, response) => {
//     console.log("FILE ADDED SSN");
//   }
// );
// app.post(
//   "/api/students/updateStudentIbanFile/:id", upload.iban, (request, response) => {
//     console.log("FILE ADDED iban");
//   }
// );

module.exports = app;
