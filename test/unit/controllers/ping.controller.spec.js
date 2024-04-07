const request = require('supertest');
const express = require('express');
const app = express();
const { ping } = require('../../../src/controllers/ping.controller.js');
const pingService = require('../../../src/services/ping.service.js');

jest.mock('../../../src/services/ping.service.js');

app.get('/ping', ping);

describe('Ping Controller', () => {
    it('should return a pong message', async () => {
        pingService.sayPong.mockResolvedValue('pong');

        const res = await request(app).get('/ping');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'pong');
    });
});