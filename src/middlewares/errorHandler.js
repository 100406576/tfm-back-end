const { Sequelize } = require('sequelize');
const NotFoundError = require('../errors/notFoundError.js')
const ConflictError = require('../errors/conflictError.js')

const errorHandler = (err, req, res, next) => {
    console.log(err);
    let statusCode;
    if (err instanceof Sequelize.ValidationError) {
        statusCode = 400;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
    } else if (err instanceof ConflictError) {
        statusCode = 409;
    }else {
        statusCode = 500;
    }
    return res.status(statusCode).send({
        error: err.message,
    });
};

module.exports = errorHandler;
