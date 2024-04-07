const User = require("../models/user.model.js");

const readUsers = async function() {
    return User.findAll();
}

const createUser = async function(dataUser) {
    await User.sync();
    await User.create(dataUser);
}

module.exports = {
    readUsers,
    createUser
}
