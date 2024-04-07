const express = require('express');
const indexRoutes = require('./routes/index.route.js');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1', indexRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
    
    return;
});

module.exports = app;