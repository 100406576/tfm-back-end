const jwt = require('jwt-simple');
const moment = require('moment');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication token not provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.decode(token, process.env.JWT_SECRET);

        const now = moment().unix();
        if (now > payload.expiresAt) {
            return res.status(401).json({ message: 'Authentication token has expired' });
        }

        req.user = payload;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
};

module.exports = authMiddleware;