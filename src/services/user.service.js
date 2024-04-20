const User = require("../models/user.model.js");
const bcryptjs = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require("moment");

const readUser = async function(username) {
    return await User.findOne({ where: { username: username } });
};

const createUser = async function(dataUser) {
    dataUser.password = bcryptjs.hashSync(dataUser.password);
    await User.sync();
    return await User.create(dataUser);
}

const isCorrectPassword = async function(introducedPassword, userPassword) {
    return await bcryptjs.compare(introducedPassword, userPassword)
}


const generateToken = function(user) {
    const payload = {
        id: user.user_id,
        username: user.username,
        createdAt: moment().unix(),
        expiresAt: moment().add(1, 'hour').unix()
    };

    const token = jwt.encode(payload, process.env.JWT_SECRET)

    return token;
};

module.exports = {
    readUser,
    createUser,
    isCorrectPassword,
    generateToken
}
