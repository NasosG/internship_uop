const express = require('express');

const app = express();

app.use('/api/students', (req, res, next) => {
  const data = [{
    id: '1',
    name: 'giorgos'
  }, {
    id: '2',
    name: 'stathis'
  }];

  res.status(200).json({
    message: 'students recovered successfully',
    data: data
  });
});

module.exports = app;
