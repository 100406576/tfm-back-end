const User = require("../models/user.model.js");
const bcryptjs = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require("moment");

const readUser = async function(username) {
    return await User.findOne({ where: { username: username } });
};

const createUser = async function(dataUser) {
    dataUser.password = bcryptjs.hashSync(dataUser.password);
    return await User.create(dataUser);
}

const isCorrectPassword = async function(introducedPassword, userPassword) {
    return await bcryptjs.compare(introducedPassword, userPassword)
}


const generateToken = function(user) {
    const payload = {
        user_id: user.user_id,
        username: user.username,
        createdAt: moment().unix(),
        expiresAt: moment().add(1, 'hour').unix()
    };

    const token = jwt.encode(payload, process.env.JWT_SECRET)

    return token;
};

const updateUser = async function(username, dataUser) {
    delete dataUser.username; // Username no se puede editar
    delete dataUser.password; // Password no se puede editar
    return await User.update(dataUser, { where: { username: username } });
}

const deleteUser = async function(username) {
    return await User.destroy({ where: { username: username } });
}

module.exports = {
    readUser,
    createUser,
    isCorrectPassword,
    generateToken,
    updateUser,
    deleteUser
}
