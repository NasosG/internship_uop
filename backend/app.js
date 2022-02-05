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
app.get('/', (request, response) => {
  response.send('<h2>hello from the server!</h2>');
});

module.exports = app;
