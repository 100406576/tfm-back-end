const express = require('express');
const indexRoutes = require('./routes/index.route.js');
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/', indexRoutes);

/* Error handler middleware */
app.use(errorHandler);

module.exports = app;