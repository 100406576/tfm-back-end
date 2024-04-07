const request = require('supertest');
const express = require('express');
const app = express();
const { readUsers } = require('../../../src/controllers/user.controller.js');
const userService = require('../../../src/services/user.service.js');

jest.mock('../../../src/services/user.service.js');

app.get('/users', readUsers);

describe('User Controller', () => {
    it('should return a list of users', async () => {
        const mockUsers = [
            { username: 'testuser1', email: 'testuser1@example.com' },
            { username: 'testuser2', email: 'testuser2@example.com' }
        ];
        userService.readUsers.mockResolvedValue(mockUsers);

        const res = await request(app).get('/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('users', mockUsers);
    });
});
