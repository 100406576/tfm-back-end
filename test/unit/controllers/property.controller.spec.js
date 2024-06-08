const request = require('supertest');
const { app } = require('../../../src/app.js');
const propertyService = require('../../../src/services/property.service.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');
const authMiddleware = require('../../../src/middlewares/auth.middleware.js');
const { ValidationError } = require('sequelize');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/services/property.service.js');

describe('Property Controller', () => {
    test('Read properties of user OK', async () => {
        const mockProperties = [{
            property_id: '1', propertyName: 'Test Property 1', user_id: '1', houseDetails: { property_id: '1', numberOfRooms: 2, hasGarden: true }
        }];
        propertyService.readPropertiesByUserId.mockResolvedValue(mockProperties);

        const res = await request(app).get('/properties');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockProperties);
    });

    test('Read properties of user KO', async () => {
        propertyService.readPropertiesByUserId.mockRejectedValue(new Error('Error'));
        
        try {
            await request(app).get('/properties');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toStrictEqual('Error');
        }
    });

    test('Read property OK', async () => {
        const mockProperty = { property_id: 1, user_id: 1, name: 'Property 1', address: 'calle italia 2', cadastralReference: '1234', houseDetails: { property_id: 1, numberOfRooms: 2, hasGarden: true } };
        propertyService.validatePropertyOwnership.mockResolvedValue();
        propertyService.readProperty.mockResolvedValue(mockProperty);

        const res = await request(app).get('/properties/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockProperty);
    });

    test('Read property KO - Property not found', async () => {
        propertyService.validatePropertyOwnership.mockResolvedValue(new NotFoundError('Property not found'));

        try {
            await request(app).get('/properties/999');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });

    test('Read property KO - Forbidden', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).get('/properties/1').set('user', { user_id: 2 });
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Create property OK', async () => {
        const mockProperty = { property_id: 1, user_id: 1, name: 'Property 1', address: 'calle italia 2', cadastralReference: '1234', houseDetails: { property_id: 1, numberOfRooms: 2, hasGarden: true } };
        propertyService.createProperty.mockResolvedValue(mockProperty);

        const res = await request(app).post('/properties').send(mockProperty);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(mockProperty);
    });

    test('Create property KO - Bad request', async () => {
        const mockProperty = { propertyName: 'Property 1', address: 'calle italia 2'};
        propertyService.createProperty.mockRejectedValue(new ValidationError('notNull Violation: Property.cadastralReference cannot be null'));

        try {
            await request(app).post('/properties').send(mockProperty);
        } catch (error) {
            expect(error.statusCode).toEqual(400);
            expect(error.body).toEqual({ error: "notNull Violation: Property.cadastralReference cannot be null" });
        }
    });

    test('Edit property OK', async () => {
        const mockUser = { username: 'testuser1', user_id: 1 };
        const mockProperty = { user_id: 1, name: 'Property 2', address: 'calle Hungría 2', cadastralReference: '1234', houseDetails: { property_id: 1, numberOfRooms: 2, hasGarden: false } };
        propertyService.validatePropertyOwnership.mockResolvedValue();
        propertyService.updateProperty.mockResolvedValue(mockProperty);

        const res = await request(app).put('/properties/1').send(mockProperty);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockProperty);
    });

    test('Edit property KO - Property not found', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new NotFoundError('Property not found'));

        try {
            await request(app).put('/properties/999').send({});
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });

    test('Edit property KO - Forbidden', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).put('/properties/1').set('user', { user_id: 2 });
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Delete property KO - Forbidden', async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).delete('/properties/1').set('user', { user_id: 2 });
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test('Delete property OK', async () => {
        propertyService.validatePropertyOwnership.mockResolvedValue();
        propertyService.deleteProperty.mockResolvedValue(1);

        const res = await request(app).delete('/properties/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Property deleted' });
    });

    test('Delete property KO - Property not found', async () => {
        propertyService.readProperty.mockResolvedValue(null);

        try {
            await request(app).delete('/properties/999');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });
});