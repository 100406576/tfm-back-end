const { Sequelize } = require('sequelize');
const NotFoundError = require('../errors/notFoundError.js')
const ConflictError = require('../errors/conflictError.js')

const errorHandler = (err, req, res, next) => {
    //console.log(err);
    let statusCode = err.status;
    if (err instanceof Sequelize.ValidationError) {
        statusCode = 400;
    }
    if (statusCode) {
        return res.status(statusCode).send({
            error: err.message,
        });
    } else {
        return res.status(500).send({
            error: 'Internal server error',
        });
    }
};

module.exports = errorHandler;
