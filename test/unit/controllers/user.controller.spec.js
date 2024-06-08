const request = require('supertest');
const { app } = require('../../../src/app.js');
const userService = require('../../../src/services/user.service.js');
const authMiddleware = require('../../../src/middlewares/auth.middleware.js');
const userValidationMiddleware = require('../../../src/middlewares/userValidation.middleware.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ConflictError = require('../../../src/errors/conflict.error.js');
const { ValidationError } = require("sequelize");

jest.mock('../../../src/services/user.service.js');
const authMiddlewareMock = (req, res, next) => {
    next();
};
const userValidationMiddlewareMock = (req, res, next) => {
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/middlewares/userValidation.middleware.js', () => userValidationMiddlewareMock);

describe('User Controller', () => {

    test('Read user OK', async () => {
        const mockUser = { username: 'testuser1', email: 'testuser1@example.com' };
        userService.readUser.mockResolvedValue(mockUser);

        const res = await request(app).get('/users/testuser1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockUser);
    });

    test('Read user KO - User not found', async () => {
        userService.readUser.mockResolvedValue(null);
        try {
            await request(app).get('/users/nonexistentuser');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('User not found');
        }
    });

    test('Create user OK', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', password: "password", email: 'testuser1@example.com' };
        userService.readUser.mockResolvedValue(null);
        userService.createUser.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/users')
            .set('Content-Type', 'application/json')
            .send(mockUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User created');
    });

    test('Create user KO - Username already exists', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', password: "password", email: 'testuser1@example.com' };
        userService.readUser.mockResolvedValue(mockUser);
    
        try {
            await request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ConflictError);
            expect(error.message).toStrictEqual('Username already exists');
        }
    });

    test('Create user KO - No password', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', email: 'testuser1@example.com' };
        userService.readUser.mockResolvedValue(null);
    
        try {
            await request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('Password is not defined');
        }
    });

    test('Create user KO - Bad Request no password', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', email: 'testuser1@example.com' };
        userService.readUser.mockResolvedValue(mockUser);

        try {
            await request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('Password is not defined');
        }
    });

    test('Create user KO - Bad Request wrong email format', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', password: "password", email: 'testuser1' };
        userService.readUser.mockResolvedValue(null);
        userService.createUser.mockRejectedValue(new ValidationError('Validation error: Invalid email format'));

        try {
            await request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('Validation error: Invalid email format');
        }
    });

    test('Login user OK', async () => {
        const mockUser = { username: 'testuser1', password: 'password' };
        userService.readUser.mockResolvedValue(mockUser);
        userService.isCorrectPassword.mockResolvedValue(true);
        userService.generateToken.mockReturnValue('testToken');

        const res = await request(app)
            .get('/users/login')
            .query(mockUser);

        expect(res.statusCode).toEqual(200);
        expect(res.headers.authorization).toBe('Bearer testToken');
        expect(res.body).toHaveProperty('message', 'Login success');
    });

    test('Login user KO - No username', async () => {
        const mockUser = { password: 'password' };
        try {
            await request(app)
                .get('/users/login')
                .query(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('No username or password');
        }
    });

    test('Login user KO - User not found', async () => {
        const mockUser = { username: 'nonexistentuser', password: 'password' };
        userService.readUser.mockResolvedValue(null);

        try {
            await request(app)
                .get('/users/login')
                .query(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(AuthorizationError);
            expect(error.message).toStrictEqual('Incorrect username or password');
        }
    });

    test('Login user KO - Incorrect password', async () => {
        const mockUser = { username: 'testuser1', password: 'wrongpassword' };
        userService.readUser.mockResolvedValue(mockUser);
        userService.isCorrectPassword.mockResolvedValue(false);

        try {
            await request(app)
                .get('/users/login')
                .query(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(AuthorizationError);
            expect(error.message).toStrictEqual('Incorrect username or password');
        }
    });

    test('Update user OK', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', password: "password", email: 'testuser1@example.com' };
        const mockUserEdited = { username: 'testuser1', name: 'paco', lastName: 'garcia', password: "password", email: 'testuser1@example.com' };

        userService.readUser.mockResolvedValue(mockUser);
        userService.updateUser.mockResolvedValue([1]);

        const res = await request(app)
            .put('/users/testuser1')
            .set('Content-Type', 'application/json')
            .send(mockUserEdited);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User updated');
    });

    test('Update user KO - User not found', async () => {
        const mockUser = { username: 'notFound', name: 'paco', lastName: 'perez', password: "password", email: 'testuser1@example.com' };
        userService.readUser.mockResolvedValue(null);

        try {
            await request(app)
                .put('/users/notFound')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('User not found');
        }
    });

    test('Delete user OK', async () => {
        userService.deleteUser.mockResolvedValue(1);

        const res = await request(app).delete('/users/testuser1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User deleted');
    });

    test('Delete user KO - User not found', async () => {
        userService.deleteUser.mockResolvedValue(0);

        try {
            await request(app).delete('/users/nonexistentuser');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('User not found');
        }
    });
});
