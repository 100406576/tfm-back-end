const userService = require("../services/user.service.js");
const NotFoundError = require('../errors/notFound.error.js')
const ConflictError = require('../errors/conflict.error.js');
const AuthorizationError = require('../errors/authorization.error.js');
const { ValidationError } = require("sequelize");

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

        if(!username || !password) {
            throw new ValidationError('No username or password');
        }

        const user = await userService.readUser(username);
        if (!user) {
            throw new AuthorizationError('Incorrect username or password')
        }

        const correctPassword = await userService.isCorrectPassword(password, user.password);
        if (!correctPassword) {
            throw new AuthorizationError('Incorrect username or password')
        }

        const token = userService.generateToken(user);

        res.header('Authorization', `Bearer ${token}`).status(200).json({
            message: "Login success",
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const username = req.params.username;
        const dataUser = req.body;

        const user = await userService.readUser(username);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        await userService.updateUser(username, dataUser);
        res.status(200).json({
            message: "User updated",
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const username = req.params.username;
        
        const nUserDeleted = await userService.deleteUser(username);
        if (nUserDeleted === 0) {
            throw new NotFoundError('User not found');
        }
        
        res.status(200).json({
            message: "User deleted",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    readUser,
    createUser,
    loginUser,
    updateUser,
    deleteUser
}