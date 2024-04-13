const User = require("../models/user.model.js");

/*const readUsers = async function() {
    return User.findAll();
}*/

const readUser = async function(username) {
    return await User.findOne({ where: { username: username } });
};

const createUser = async function(dataUser) {
    await User.sync();
    return await User.create(dataUser);
}

module.exports = {
    //readUsers,
    readUser,
    createUser
}
