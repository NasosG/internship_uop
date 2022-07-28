// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
// const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cron = require('node-cron');

// Route imports
const studentRoutes = require("./api-routes/studentRoutes.js");
const atlasRoutes = require("./api-routes/atlasRoutes.js");
const depManagerRoutes = require("./api-routes/depManagerRoutes.js");
const companyRoutes = require("./api-routes/companyRoutes.js");
const officeRoutes = require("./api-routes/officeRoutes.js");

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

app.get("/", async (request, response) => {
  response.send("<h2>hello from the server!</h2>");
  // await testMSSQL();
});

app.use("/api/students", studentRoutes);
app.use("/api/atlas", atlasRoutes);
app.use("/api/depmanager", depManagerRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/office", officeRoutes);

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

// cron.schedule('*/1 * * * * *', () => {
//   console.log("running every second");
// });

module.exports = app;
