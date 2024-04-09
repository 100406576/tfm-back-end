const userService = require("../services/user.service.js");

const readUsers = async (req, res) => {
    try {
        const response = await userService.readUsers();
        res.json({'users': response});
    } catch (error) {
        console.error(error);
        res.status(500).send({
            msg: 'Internal server error',
            error: error.message,
        });
    }
};

const readUser = async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await userService.readUser(username);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const dataUser = req.body;
        await userService.createUser(dataUser)
        res.status(201).json({
            message: "User created",
        });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    readUsers,
    readUser,
    createUser
}