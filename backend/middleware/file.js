const multer = require("multer");
const path = require("path");
const fs = require('fs');

getCurrentDate = () => {
  let today = new Date();
  let year = today.getFullYear().toString();
  let month = (today.getMonth() + 1).toString().padStart(2, '0');
  let day = today.getDate().toString().padStart(2, '0');
  return year + month + day;
};

const storageIban = multer.diskStorage({
  // destination: "./uploads/ibans",
  destination: (req, file, cb) => {
    const studentId = req.params.id;
    const path = `./uploads/ibans/${studentId}`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (request, file, cb) {
    cb(null, getCurrentDate() + "." + file.mimetype.split("/")[1]);
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

const storageSsn = multer.diskStorage({
  // destination: "./uploads/ssns",
  destination: (req, file, cb) => {
    const studentId = req.params.id;
    const path = `./uploads/ssns/${studentId}`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (request, file, cb) {
    cb(null, getCurrentDate() + "." + file.mimetype.split("/")[1]);
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
let iban = (uploadIban.single("file"));
let ssn = (uploadSsn.single("file"));

// module.exports = uploadIban.single("file");

module.exports = {
  iban,
  ssn
};
