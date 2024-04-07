import User from "../models/user.model.js"

const readUsers = async function() {
    return User.findAll();
}

const createUser = async function(dataUser) {
    await User.sync();
    await User.create(dataUser)
}

export default {
    readUsers,
    createUser
}