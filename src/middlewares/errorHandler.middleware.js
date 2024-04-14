const { ValidationError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
    //console.log(err);
    let statusCode = err.status;
    if (err instanceof ValidationError) {
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
