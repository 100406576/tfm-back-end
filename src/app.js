const express = require('express');
const sequelize = require('./models/index.js');
const cors = require('cors');
const indexRoutes = require('./routes/index.route.js');
const errorHandler = require('./middlewares/errorHandler.middleware.js');

const app = express();

sequelize.sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

const corsOptions = {
    exposedHeaders: 'Authorization',
  };
  
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// Routes
app.use('/', indexRoutes);

/* Error handler middleware */
app.use(errorHandler);

module.exports = app;