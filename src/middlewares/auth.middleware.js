const jwt = require('jwt-simple');
const moment = require('moment');
const AuthorizationError = require('../errors/authorization.error.js');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AuthorizationError('Authentication token not provided');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.decode(token, process.env.JWT_SECRET);

        const now = moment().unix();
        if (now > payload.expiresAt) {
            throw new AuthorizationError('Authentication token has expired');
        }

        req.user = payload;

        next();
    } catch (error) {
        throw new AuthorizationError('Invalid authentication token');
    }
};

module.exports = authMiddleware;