const request = require('supertest');
const app = require('../../../src/app.js');
const bcryptjs = require('bcryptjs');
const userService = require('../../../src/services/user.service.js');
const NotFoundError = require('../../../src/errors/notFoundError.js')
const ConflictError = require('../../../src/errors/conflictError.js')
const { Sequelize, ValidationError } = require("sequelize");

jest.mock('../../../src/services/user.service.js');
jest.mock('bcryptjs', () => ({
    hashSync: jest.fn(() => 'hashedPassword'),
}));

describe('User Controller', () => {
    /*test('Read users', async () => {
        const mockUsers = [
            { username: 'testuser1', email: 'testuser1@example.com' },
            { username: 'testuser2', email: 'testuser2@example.com' }
        ];
        userService.readUsers.mockResolvedValue(mockUsers);

        const res = await request(app).get('/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('users', mockUsers);
    });*/
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
            expect(error.message).toBe('User not found');
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
            const res = await request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ConflictError);
            expect(error.message).toBe('Username already exists');
        }
    });
    test('Create user KO - Bad Request no password', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', email: 'testuser1@example.com' };
        userService.readUser.mockResolvedValue(mockUser);

        try {
            const res = await request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Password is not defined');
        }
    });
    test('Create user KO - Bad Request wrong email format', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', password: "password", email: 'testuser1' };
        userService.readUser.mockResolvedValue(null);
        userService.createUser.mockImplementation(() => {
            throw new Sequelize.ValidationError();
        });

        try {
            const res = await request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(mockUser);
        } catch (error) {
            expect(error).toBeInstanceOf(Sequelize.ValidationError);
            expect(error.message).toBe('Password is not defined');
        }
    });
});
