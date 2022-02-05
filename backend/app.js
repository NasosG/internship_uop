const express = require('express');
const db = require("./services/studentService.js");
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.get('/api/students', db.getStudents);

module.exports = app;
