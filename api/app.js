const express = require('express');

const middleware = require('./middleware');

const app = express();

app.use(middleware);

module.exports = app;
