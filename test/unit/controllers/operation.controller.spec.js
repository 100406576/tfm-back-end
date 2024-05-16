const request = require('supertest');
const { app } = require('../../../src/app.js');
const propertyService = require('../../../src/services/property.service.js');
const operationService = require('../../../src/services/operation.service.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');
const authMiddleware = require('../../../src/middlewares/auth.middleware.js');
const userValidationMiddleware = require('../../../src/middlewares/userValidation.middleware.js');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
const userValidationMiddlewareMock = (req, res, next) => {
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/middlewares/userValidation.middleware.js', () => userValidationMiddlewareMock);
jest.mock('../../../src/services/user.service.js');
jest.mock('../../../src/services/property.service.js');
jest.mock('../../../src/services/operation.service.js');

describe('Operation Controller', () => {
    test('Read operations of property OK', async () => {
        const mockOperations = [{ id: 1, type: 'Mensualidad', description: "Mensualidad abril 2024", value: 900.00, property_id: 1 },
        { id: 2, type: 'Factura', description: "Gas abril 2024", value: -40.00, property_id: 1 }];

        propertyService.readProperty.mockResolvedValue({ property_id: 1, user_id: 1 });
        operationService.readOperationsByPropertyId.mockResolvedValue(mockOperations);

        const res = await request(app).get('/operations/property/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockOperations);
    });

    test('Read operations of property KO - Property not found', async () => {
        propertyService.readProperty.mockResolvedValue(null);

        try {
            await request(app).get('/operations/property/999');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });

    test('Read operations of property KO - Forbidden', async () => {
        propertyService.readProperty.mockResolvedValue({ property_id: 1, user_id: 2 });

        try {
            await request(app).get('/operations/property/1');
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to see the operations of this property');
        }
    });

    test('Read operation OK', async () => {
        const mockOperation = { id: 1, type: 'Mensualidad', description: "Mensualidad abril 2024", value: 900.00, property_id: 1 };

        operationService.readOperation.mockResolvedValue(mockOperation);
        propertyService.readProperty.mockResolvedValue({ property_id: 1, user_id: 1 });

        const res = await request(app).get('/operations/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockOperation);
    });

    test('Read operation KO - Operation not found', async () => {
        operationService.readOperation.mockResolvedValue(null);

        try {
            await request(app).get('/operations/999');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Operation not found');
        }
    });

    test('Read operation KO - Forbidden', async () => {
        const mockOperation = { id: 1, type: 'Mensualidad', description: "Mensualidad abril 2024", value: 900.00, property_id: 1 };

        operationService.readOperation.mockResolvedValue(mockOperation);
        propertyService.readProperty.mockResolvedValue({ property_id: 1, user_id: 2 });

        try {
            await request(app).get('/operations/1');
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to see the operation');
        }
    });
});