const express = require('express');
const studentRoutes = require("./api-routes/studentRoutes.js");
const app = express();
const cors = require('cors');

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

module.exports = app;
