const request = require('supertest');
const { app } = require('../../../src/app.js');
const propertyService = require('../../../src/services/property.service.js');
const balanceService = require('../../../src/services/balance.service.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');
const authMiddleware = require('../../../src/middlewares/auth.middleware.js');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/services/property.service.js');
jest.mock('../../../src/services/balance.service.js');


describe('Balance Controller', () => {
    test('Create balance OK', async () => {
        const body = {
            property_id: "1",
            dateRange: {
                startDate: "2024-04-01",
                endDate: "2024-04-30"
            },
            timeInterval: 1
        }

        const mockBalance = {
            labels: [ "1/4/2024-30/4/2024"],
            income: [ 143.01 ],
            expenses: [ 100.00 ],
            balance_id: "2",
            property_id: "1"
        }

        propertyService.validatePropertyOwnership.mockResolvedValue();
        balanceService.calculateBalanceForInterval.mockResolvedValue(mockBalance);

        const res = await request(app).post('/balances').send(body);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(mockBalance);
    });

    test('Create balance KO - Missing required fields', async () => {
        try {
            await request(app).post('/balances').send({});
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('Missing required fields');
        }
    });

    test('Create balance KO - Invalid time interval', async () => {
        try {
            await request(app).post('/balances').send({
                property_id: "1",
                dateRange: {
                    startDate: "2024-04-01",
                    endDate: "2024-04-30"
                },
                timeInterval: -1
            });
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('Invalid time interval');
        }
    });

    test('Create balance KO - Forbidden', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).post('/balances').send({
                property_id: "1",
                dateRange: {
                    startDate: "2024-04-01",
                    endDate: "2024-04-30"
                },
                timeInterval: 1
            });
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Create balance KO - Property not found', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new NotFoundError('Property not found'));

        try {
            await request(app).post('/balance').send({
                property_id: "1",
                dateRange: {
                    startDate: "2024-04-01",
                    endDate: "2024-04-30"
                },
                timeInterval: 1
            });
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });
});