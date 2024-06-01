const request = require('supertest');
const { app } = require('../../../src/app.js');
const propertyService = require('../../../src/services/property.service.js');
const operationService = require('../../../src/services/operation.service.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');
const authMiddleware = require('../../../src/middlewares/auth.middleware.js');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/services/user.service.js');
jest.mock('../../../src/services/property.service.js');
jest.mock('../../../src/services/operation.service.js');

describe('Operation Controller', () => {
    const mockOperation = { id: 1, description: "Mensualidad abril 2024", date: new Date().toISOString(), type: 'income', value: 900.00, property_id: 1 };

    test('Read operations of property OK', async () => {
        const mockOperations = [mockOperation,
        { id: 2, description: "Gas abril 2024", date: new Date().toISOString(), type: 'expense', value: 40.00, property_id: 1 }];

        propertyService.validatePropertyOwnership.mockResolvedValue();
        operationService.readOperationsByPropertyId.mockResolvedValue(mockOperations);

        const res = await request(app).get('/operations/property/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockOperations);
    });

    test('Read operations of property KO - Property not found', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new NotFoundError('Property not found'));

        try {
            await request(app).get('/operations/property/999');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });

    test('Read operations of property KO - Forbidden', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).get('/operations/property/1');
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Read operation OK', async () => {
        operationService.readOperation.mockResolvedValue(mockOperation);
        propertyService.validatePropertyOwnership.mockResolvedValue();

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
        operationService.readOperation.mockResolvedValue(mockOperation);
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).get('/operations/1');
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Create operation OK', async () => {
        propertyService.validatePropertyOwnership.mockResolvedValue();
        operationService.createOperation.mockResolvedValue(mockOperation);

        const res = await request(app)
            .post('/operations')
            .send(mockOperation);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(mockOperation);
    });

    test('Create operation KO - Validation error', async () => {
        const mockOperation = { id: 1, description: "Mensualidad abril 2024", date: new Date().toISOString(), type: 'income', value: 900.00};
        try {
            await request(app)
                .post('/operations')
                .send(mockOperation);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('property_id is required');
        }
    });

    test('Create operation KO - Property not found', async () => {
        const mockOperationNotFound = { type: 'Mensualidad', description: "Mensualidad abril 2024", date: new Date().toISOString(), value: 900.00, property_id: 999 };

        propertyService.validatePropertyOwnership.mockRejectedValue(new NotFoundError('Property not found'));

        try {
            await request(app)
                .post('/operations')
                .send(mockOperationNotFound);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });

    test('Create operation KO - Forbidden', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app)
                .post('/operations')
                .send(mockOperation);
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Update operation OK', async () => {
        const mockOperationUpdate = { description: "Mensualidad mayo 2024", date: new Date().toISOString(), type: 'income', value: 900.00, property_id: 1 };

        propertyService.validatePropertyOwnership.mockResolvedValue();
        operationService.updateOperation.mockResolvedValue(mockOperationUpdate);

        const res = await request(app)
            .put('/operations/1')
            .send(mockOperationUpdate);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockOperationUpdate);
    });

    test('Update operation KO - Operation not found', async () => {
        operationService.readOperation.mockResolvedValue(null);

        try {
            await request(app)
                .put('/operations/999')
                .send(mockOperation);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Operation not found');
        }
    });

    test('Update operation KO - Forbidden', async () => {
        operationService.readOperation.mockResolvedValue(mockOperation);
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app)
                .put('/operations/1')
                .send(mockOperation);
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Delete operation OK', async () => {
        operationService.readOperation.mockResolvedValue(mockOperation);
        propertyService.validatePropertyOwnership.mockResolvedValue();
        operationService.deleteOperation.mockResolvedValue(1);

        const res = await request(app).delete('/operations/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Operation deleted' });
    });

    test('Delete operation KO - Operation not found', async () => {
        operationService.readOperation.mockResolvedValue(null);

        try {
            await request(app).delete('/operations/999');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Operation not found');
        }
    });

    test('Delete operation KO - Forbidden', async () => {
        operationService.readOperation.mockResolvedValue(mockOperation);
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).delete('/operations/1');
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });
});