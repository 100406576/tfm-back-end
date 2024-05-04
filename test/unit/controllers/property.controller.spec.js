const request = require('supertest');
const { app } = require('../../../src/app.js');
const userService = require('../../../src/services/user.service.js');
const propertyService = require('../../../src/services/property.service.js');
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

describe('Property Controller', () => {
    test('Read properties of user OK', async () => {
        const mockUser = { username: 'testuser1', user_id: 1 };
        const mockProperties = [{
            property_id: '1', propertyName: 'Test Property 1', user_id: '1', houseDetails: { property_id: '1', numberOfRooms: 2, hasGarden: true }
        }];
        userService.readUser.mockResolvedValue(mockUser);
        propertyService.readPropertiesByUserId.mockResolvedValue(mockProperties);

        const res = await request(app).get('/users/testuser1/properties');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockProperties);
    });

    test('Read properties of user KO - User not found', async () => {
        userService.readUser.mockResolvedValue(null);

        try {
            await request(app).get('/users/nonexistuser/properties');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('User not found');
        }
    });

    test('Read property OK', async () => {
        const mockProperty = { property_id: 1, user_id: 1, name: 'Property 1', address: 'calle italia 2', cadastralReference: '1234', houseDetails: { property_id: 1, numberOfRooms: 2, hasGarden: true } };
        propertyService.readProperty.mockResolvedValue(mockProperty);

        const res = await request(app).get('/properties/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockProperty);
    });

    test('Read property KO - Property not found', async () => {
        propertyService.readProperty.mockResolvedValue(null);

        try {
            await request(app).get('/properties/999');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });

    test('Read property KO - Forbidden', async () => {
        const mockProperty = { property_id: 1, user_id: 2, name: 'Property 1', address: 'calle italia 2', cadastralReference: '1234', houseDetails: { property_id: 1, numberOfRooms: 2, hasGarden: true } };
        propertyService.readProperty.mockResolvedValue(mockProperty);

        try {
            await request(app).get('/properties/1').set('user', { user_id: 2 });
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to see this property');
        }
    });

    test('Delete property OK', async () => {
        propertyService.readProperty.mockResolvedValue({ property_id: 1, user_id: 1 });
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