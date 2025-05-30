const multer = require("multer");
const path = require("path");
const fs = require('fs');
// Importing Utilities module
const util = require('util');
const MiscUtils = require("../utils/MiscUtils.js");
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
    //fsExtra.emptyDirSync(fileDir);

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

const storageAffidavit = multer.diskStorage({
  destination: (req, file, cb) => {
    const studentId = req.params.id;
    const fileDir = process.env.UPLOAD_FILE_PATH + "affidavit/";
    const path = fileDir + studentId;

    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (request, file, cb) {
    const studentId = request.params.id;
    const fileName = "student" + studentId + "_" + "AFFIDAVIT";
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

const uploadAffidavit = multer({
  storage: storageAffidavit,
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

// remove duplicate code of above code with these 2 functions below
// TODO: refactor the code above in a safe way
const createStorage = (fileDir, prefix) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const studentId = req.params.id;
      const path = fileDir + studentId;

      fs.mkdirSync(path, { recursive: true });
      return cb(null, path);
    },
    filename: function (request, file, cb) {
      const studentId = request.params.id;
      const fileName = "student" + studentId + "_" + prefix;
      const formattedExtension = MiscUtils.formatDocExtension(file.mimetype.split("/")[1]);
      cb(null, fileName + "." + formattedExtension);
    }
  });
};

const createUpload = (storage) => {
  return multer({
    storage,
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
};


let iban = util.promisify(uploadIban.single("file"));
let ssn = util.promisify(uploadSsn.single("file"));
let amea = util.promisify(uploadAmea.single("file"));
let affidavit = util.promisify(uploadAffidavit.single("file"));

// New types - AMA and ID files
const amaNumberStorage = createStorage(process.env.UPLOAD_FILE_PATH + "ama/", 'AMA');
const policeIdStorage = createStorage(process.env.UPLOAD_FILE_PATH + "identity/", 'IDENTITY');
const ama = util.promisify(createUpload(amaNumberStorage).single("file"));
const policeId = util.promisify(createUpload(policeIdStorage).single("file"));

// Resignation app for students' interest app submissions
const resignApp = util.promisify(createUpload(createStorage(process.env.UPLOAD_FILE_PATH + "resign/", 'RESIGN')).single("file"));

module.exports = {
  iban,
  ssn,
  amea,
  affidavit,
  ama,
  policeId,
  resignApp
};
