const userService = require("../services/user.service.js");
const sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const NotFoundError = require('../errors/notFound.error.js')
const ConflictError = require('../errors/conflict.error.js');
const AuthorizationError = require('../errors/authorization.error.js');
const { ValidationError } = require("sequelize");

/*const readUsers = async (req, res) => {
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
};*/

const readUser = async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await userService.readUser(username);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const dataUser = req.body;
        const user = await userService.readUser(dataUser.username);

        if (user) {
            throw new ConflictError('Username already exists');
        }

        if(!dataUser.password) {
            throw new ValidationError('Password is not defined');
        }

        await userService.createUser(dataUser);
        res.status(201).json({
            message: "User created",
        });
    } catch (error) {
        next(error)
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.query;

        const user = await userService.readUser(username);
        if (!user) {
            throw new AuthorizationError('Incorrect username or password')
        }

        const correctPassword = await userService.isCorrectPasssword(password, user.password);
        if (!correctPassword) {
            throw new AuthorizationError('Incorrect username or password')
        }

        const token = userService.generateToken(user);

        console.log(token);
        res.header('Authorization', `Bearer ${token}`).status(200).json({
            message: "Login success",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    //readUsers,
    readUser,
    createUser,
    loginUser
}