// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
// const cron = require('node-cron');
const atlasController = require('./controllers/atlasController.js');
const MiscUtils = require("./MiscUtils.js");

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

app.use((_request, response, next) => {
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

app.get("/", async (_request, response) => {
  response.send("<h2>hello from the server!</h2>");
  // await testMSSQL();
});

app.use("/api/students", studentRoutes);
app.use("/api/atlas", atlasRoutes);
app.use("/api/depmanager", depManagerRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/office", officeRoutes);

/** Cron Jobs */
// Runs every hour
// cron.schedule('0 0 * * * *', async () => {
//   await atlasController.insertOrUpdateAtlasTables();
// });

// Update Atlas latest positions / providers, every hour
setInterval(async () => await atlasController.insertOrUpdateAtlasTables(), MiscUtils.ONE_HOUR);
// Update all Atlas positions / providers, every 30 hours
setInterval(async () => await atlasController.insertOrUpdateWholeAtlasTables(), MiscUtils.THIRTY_HOURS);

/**
 * Update the following Atlas Tables every 30 hours (if there are records to be updated or inserted).
 * These tables do not change very ofter (if ever), so we update them less frequently.
 * - ATLAS Cities
 * - ATLAS Countries
 * - ATLAS Physical objects (list of positions' subject: "Ανθρώπινο Δυναμικό", "Βοηθητικό προσωπικό", "Δημόσιες σχέσεις" etc.)
 * - ATLAS Prefecture
*/
setInterval(async () => await atlasController.insertOrUpdateImmutableAtlasTables(), MiscUtils.THIRTY_HOURS);

module.exports = app;
