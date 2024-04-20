const request = require('supertest');
const express = require('express');
const jwt = require('jwt-simple');
const moment = require('moment');
const authMiddleware = require('../../../src/middlewares/auth.middleware');
const AuthorizationError = require('../../../src/errors/authorization.error');

const app = express();
app.use(authMiddleware);
app.get('/', (req, res) => res.status(200).send('OK'));
jest.mock('jwt-simple');

describe('Auth Middleware', () => {
    test('Auth KO - Token not provided', async () => {
        try {
            await request(app).get('/');
        } catch (error) {
            expect(error).toBeInstanceOf(AuthorizationError);
            expect(error.message).toBe('Authentication token not provided');
        }
    });

    test('Auth KO the token is invalid', async () => {
        jwt.decode.mockImplementation(() => {
            throw new Error();
        });
        try {
            await request(app).get('/').set('Authorization', 'Bearer invalidToken');
        } catch (error) {
            expect(error).toBeInstanceOf(AuthorizationError);
            expect(error.message).toBe('Invalid authentication token');
        }
    });

    test('Auth KO - token has expired', async () => {
        jwt.decode.mockReturnValue({
            expiresAt: moment().subtract(1, 'days').unix()
        });

        try {
            await request(app).get('/').set('Authorization', 'Bearer expiredToken');
        } catch (error) {
            expect(error).toBeInstanceOf(AuthorizationError);
            expect(error.message).toBe('Authentication token has expired');
        }
    });

    test('Auth OK', async () => {
        jwt.decode.mockReturnValue({ expiresAt: moment().add(1, 'days').unix() });

        const res = await request(app).get('/').set('Authorization', `Bearer validToken`);
        expect(res.status).toBe(200);
    });
});