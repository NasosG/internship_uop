const express = require('express');
const studentRoutes = require("./api-routes/studentRoutes.js");
const app = express();
const cors = require('cors');
const multer = require('multer');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.json());
// app.use(cors());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.get('/', (request, response) => {
  response.send('<h2>hello from the server!</h2>');
});

app.use('/api/students', studentRoutes);

const storageSsn = multer.diskStorage({
  destination: './uploads/ssns',
  filename: function (request, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

const storageIban = multer.diskStorage({
  destination: './uploads/ibans',
  filename: function (request, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

const uploadSsn = multer({
  storage: storageSsn
});

const uploadIban = multer({
  storage: storageIban
});

app.post('/api/students/updateStudentSSNFile/:id', uploadSsn.single('file'), (request, response) => {
  console.log('FILE ADDED SSN');
});

app.post('/api/students/updateStudentIbanFile/:id', uploadIban.single('file'), (request, response) => {
  console.log('FILE ADDED IBAN');
});


module.exports = app;
