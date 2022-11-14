const multer = require("multer");
const path = require("path");
const fs = require('fs');
// Importing Utilities module
const util = require('util');
const fsExtra = require('fs-extra');
const MiscUtils = require("../MiscUtils.js");
require('dotenv').config();

getCurrentDate = () => {
  let today = new Date();
  let year = today.getFullYear().toString();
  let month = (today.getMonth() + 1).toString().padStart(2, '0');
  let day = today.getDate().toString().padStart(2, '0');
  return year + month + day;
};

const storageIban = multer.diskStorage({
  destination: (req, file, cb) => {
    const studentId = req.params.id;
    const fileDir = process.env.UPLOAD_FILE_PATH + "ibans/";
    const path = fileDir + studentId;

    // remove all files before inserting the new one
    // in order to always keep the one last file student has posted
    fsExtra.emptyDirSync(fileDir);

    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (request, file, cb) {
    const studentId = request.params.id;
    const fileName = "student" + studentId + "_" + "IBAN";
    const formattedExtension = MiscUtils.formatDocExtension(file.mimetype.split("/")[1]);
    cb(null, fileName + "." + formattedExtension);
  }
});

const uploadIban = multer({
  storage: storageIban,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (!MiscUtils.FILE_TYPES_WITH_DOT.includes(ext)) {
      return callback(new Error("This file type is not valid"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 244140625
  }
});

const storageSsn = multer.diskStorage({
  destination: (req, file, cb) => {
    const studentId = req.params.id;
    const fileDir = process.env.UPLOAD_FILE_PATH + "ssns/";
    const path = fileDir + studentId;

    // remove all files before inserting the new one
    // in order to always keep the one last file student has posted
    fsExtra.emptyDirSync(fileDir);

    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (request, file, cb) {
    const studentId = request.params.id;
    const fileName = "student" + studentId + "_" + "SSN";
    const formattedExtension = MiscUtils.formatDocExtension(file.mimetype.split("/")[1]);
    cb(null, fileName + "." + formattedExtension);
  }
});

const uploadSsn = multer({
  storage: storageSsn,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (!MiscUtils.FILE_TYPES_WITH_DOT.includes(ext)) {
      return callback(new Error("This file type is not valid"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 244140625
  }
});

const storageAmea = multer.diskStorage({
  destination: (req, file, cb) => {
    const studentId = req.params.id;
    const fileDir = process.env.UPLOAD_FILE_PATH + "amea/";
    const path = fileDir + studentId;

    // remove all files before inserting the new one
    // in order to always keep the one last file student has posted
    fsExtra.emptyDirSync(fileDir);

    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (request, file, cb) {
    const studentId = request.params.id;
    const fileName = "student" + studentId + "_" + "AMEA";
    const formattedExtension = MiscUtils.formatDocExtension(file.mimetype.split("/")[1]);
    cb(null, fileName + "." + formattedExtension);
  }
});

const uploadAmea = multer({
  storage: storageAmea,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (!MiscUtils.FILE_TYPES_WITH_DOT.includes(ext)) {
      return callback(new Error("This file type is not valid"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 244140625
  }
});

let iban = util.promisify(uploadIban.single("file"));
let ssn = util.promisify(uploadSsn.single("file"));
let amea = util.promisify(uploadAmea.single("file"));
// module.exports = uploadIban.single("file");

module.exports = {
  iban,
  ssn,
  amea
};
