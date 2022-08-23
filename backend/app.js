// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
// const cron = require('node-cron');
const atlasController = require('./controllers/atlasController.js');
const MiscUtils = require("./MiscUtils.js");
const nodemailer = require('nodemailer');
const gmailTransporter = require('./mailer_config.js');

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
setInterval(async () => await atlasController.insertOrUpdateImmutableAtlasTables(), MiscUtils.THREE_HOURS);

async function mainMailer() {
  // send mail with defined transport object
  let pswd = generatePassword(12);
  let info = await gmailTransporter.sendMail({
    from: "praktiki@uop.com", // sender address
    to: "", // list of receivers
    subject: "Password Reset", // Subject line
    // send the email to the user to let him know that password has been changed
    html: "<span>Hello, You're receiving this email because you requested a password reset for your account.</span><br><br>" +
      "<span>Your new password is: <strong>" + pswd + "</strong></span><br><br>" +
      "<span>Click on the button below to login with your new password</span><br><br>" +
      "<a href='http://localhost:4200/credentials-generic' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Login</a>"
  });

  console.log("Message sent: %s", info.messageId);
}

// generate a pseudorandom password
function generatePassword(passwordLength) {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
}

mainMailer().catch(console.error);

module.exports = app;
