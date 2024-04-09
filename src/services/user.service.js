const User = require("../models/user.model.js");
const NotFoundError = require('../errors/notFoundError.js')
const ConflictError = require('../errors/conflictError.js')

const readUsers = async function() {
    return User.findAll();
}

const readUser = async function(username) {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

const userExists = async function(username) {
    const user = await User.findOne({ where: { username: username } });
    if (user) {
        return true;
    }
    return false;
};

const createUser = async function(dataUser) {
    await User.sync();
    if (await userExists(dataUser.username)) {
        throw new ConflictError('Username already exists');
    }
    await User.create(dataUser);
}

module.exports = {
    readUsers,
    readUser,
    createUser
}
