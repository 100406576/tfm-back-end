const express = require('express');
const cors = require('cors');
const indexRoutes = require('./routes/index.route.js');
const errorHandler = require('./middlewares/errorHandler.middleware.js');

const app = express();

app.use(cors());

// Middlewares
app.use(express.json());

// Routes
app.use('/', indexRoutes);

/* Error handler middleware */
app.use(errorHandler);

module.exports = app;