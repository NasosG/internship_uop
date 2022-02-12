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
// app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get('/api/students', db.getStudents);
app.get('/', (request, response) => {
  response.send('<h2>hello from the server!</h2>');
});
app.post("/api/students/addBio", db.addStudentsBio);

module.exports = app;
