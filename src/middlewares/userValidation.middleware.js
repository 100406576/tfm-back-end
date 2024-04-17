const ForbiddenError = require('../errors/forbidden.error.js');

const userValidationMiddleware = (req, res, next) => {
    const requestedUsername = req.params.username;
    const authenticatedUsername = req.user.username;

    if (requestedUsername === authenticatedUsername) {
        next();
    } else {
        throw new ForbiddenError('Access denied')
    }
};

module.exports = userValidationMiddleware;
