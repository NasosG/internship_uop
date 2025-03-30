// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cron = require('node-cron');
const atlasController = require('./controllers/atlasController.js');
const MiscUtils = require("./utils/MiscUtils.js");
// Jobs
const setPeriodCompletedJob = require('./jobs/setPeriodCompleted.js');
const deleteOldPositionsAtlasJob = require('./jobs/deleteOldPositionsAtlas.js');
const syncAtlasPositionAcademics = require('./jobs/syncAtlasPositionAcademics.js');
const logger = require('./config/logger');

// Route imports
const studentRoutes = require("./api-routes/studentRoutes.js");
const atlasRoutes = require("./api-routes/atlasRoutes.js");
const opsRoutes = require("./api-routes/OPSRoutes.js");
const depManagerRoutes = require("./api-routes/depManagerRoutes.js");
const companyRoutes = require("./api-routes/companyRoutes.js");
const officeRoutes = require("./api-routes/officeRoutes.js");
const adminRoutes = require("./api-routes/adminRoutes.js");

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

app.get("/api", async (_request, response) => {
  response.send("<h2>hello from the server!</h2>");
  // await testMSSQL();
});

app.use("/api/students", studentRoutes);
app.use("/api/atlas", atlasRoutes);
app.use("/api/depmanager", depManagerRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/office", officeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ops", opsRoutes);

// test CAS
var session = require('express-session');
var CASAuthentication = require('node-cas-authentication');

// Set up an Express session, which is required for CASAuthentication.
app.use(session({
  secret: 'super secret key',
  resave: false,
  saveUninitialized: true
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
  cas_url: 'https://sso.uop.gr:443',
  service_url: 'http://praktiki-new.uop.gr:3000',
  cas_version: 'saml1.1',
  return_to: '',
  session_name: 'cas_user',
  session_info: 'cas_userinfo'
});

app.get('/authenticate', cas.bounce_redirect);

// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
app.get('/authSSO', cas.bounce, function (req, res) {
  let sessionInfo = req.session[cas.session_info];
  let sessionUser = req.session[cas.session_name];

  //res.send('<html><body>Hello + a + b !</body></html>');
  res.json({ cas_userinfo: req.session[cas.session_info], cas_user: sessionUser });
});


// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
app.get('/api', cas.block, function (req, res) {
  logger.info("Some debug messages");
  res.json({ success: true });
});

app.get('/api/user', cas.block, function (req, res) {
  res.json({ cas_user: req.session[cas.session_name] });
});


/** Cron Jobs */
// Runs every hour
// cron.schedule('0 0 * * * *', async () => {
//   await atlasController.insertOrUpdateAtlasTables();
// });

// Schedule a job to run every night at 23:58 to update the state of the period if it is completed
cron.schedule("58 23 * * *", async () => {
  try {
    await setPeriodCompletedJob.setPeriodCompleted();
  } catch (error) {
    logger.error(error);
  }
}, {
  scheduled: true,
  timezone: "Europe/Athens"
});

cron.schedule("30 21 * * *", async () => {
  try {
    await deleteOldPositionsAtlasJob.doDelete();
  } catch (error) {
    logger.error(error);
  }
}, {
  scheduled: true,
  timezone: "Europe/Athens"
});

cron.schedule("37 01 * * *", async () => {
  try {
    await syncAtlasPositionAcademics.executeSync();
  } catch (error) {
    logger.error(error);
  }
}, {
  scheduled: true,
  timezone: "Europe/Athens"
});

// Update Atlas latest positions / providers, every hour
//setInterval(async () => await atlasController.insertOrUpdateAtlasTables(), MiscUtils.ONE_HOUR);

const updateAtlasTables = async () => {
  logger.info("Update started at: " + new Date().toLocaleString());
  await atlasController.insertOrUpdateAtlasTables();
};

(async () => {
  await updateAtlasTables();
})();

// setInterval(updateAtlasTables, MiscUtils.ONE_N_HALF_HOUR);
setInterval(updateAtlasTables, MiscUtils.SEVEN_HOURS);

// Update all Atlas positions / providers, every 30 hours
//setInterval(async () => await atlasController.insertOrUpdateWholeAtlasTables(), MiscUtils.THIRTY_HOURS);

/**
 * Update the following Atlas Tables every 30 hours (if there are records to be updated or inserted).
 * These tables do not change very ofter (if ever), so we update them less frequently.
 * - ATLAS Cities
 * - ATLAS Countries
 * - ATLAS Physical objects (list of positions' subject: "Ανθρώπινο Δυναμικό", "Βοηθητικό προσωπικό", "Δημόσιες σχέσεις" etc.)
 * - ATLAS Prefecture
*/
setInterval(async () => await atlasController.insertOrUpdateImmutableAtlasTables(), MiscUtils.THREE_HOURS);

module.exports = app;
