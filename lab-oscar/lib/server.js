'use strict';
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

let server;
const app = express();

app.get('/api/hello', (req, res, next) => {
  res.send('hello World');
});
app.use(require('../route/user-router.js'));


app.use((err, req, res, next) => {
  console.log(err);
  if(err.message.includes('Cast to ObjectId'))
    return res.sendStatus(404);
  res.sendStatus(500);
});
const serverControl = module.exports = {};

serverControl.start = () => {
  return new Promise((resolve) => {
    server = app.listen(process.env.PORT, () => {
      console.log('server is running', process.env.PORT);
      server.isOn = true;
      resolve();
    });
  });
};

serverControl.stop = () => {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('server is down');
      server.isOn = false;
      resolve();
    });
  });
};
