const request = require('supertest');
const { app } = require('../../../src/app.js');
const propertyService = require('../../../src/services/property.service.js');
const taxService = require('../../../src/services/taxReturn.service.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');
const authMiddleware = require('../../../src/middlewares/auth.middleware.js');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/services/property.service.js');
jest.mock('../../../src/services/taxReturn.service.js');


describe('TaxReturn Controller', () => {
    test('Calculate tax return OK', async () => {
        const body = {
            property_id: "1",
            fiscalYear: 2023,
            numberOfDaysRented: 365,
            previousYearsImprovements: 0,
            currentYearImprovements: 10000
        }

        const mockTaxReturn = {
            taxReturn_id: "2",
            property_id: "1",
            fiscalYear: 2023,
            taxableIncome: 15000,
            deductibleExpenses: 3000,
            amortization: 2368.97,
        }

        propertyService.validatePropertyOwnership.mockResolvedValue();
        taxService.calculateTaxReturn.mockResolvedValue(mockTaxReturn);

        const res = await request(app).post('/tax-return').send(body);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockTaxReturn);
    });

    test("Calculate tax return KO - Missing required fields", async () => {
        try {
            await request(app).post('/tax-return').send({
                fiscalYear: 2023,
                numberOfDaysRented: 365,
                previousYearsImprovements: 0,
                currentYearImprovements: 10000
            });
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('property_id is required');
        }
    });

    test("Calculate tax return KO - Invalid fiscal year", async () => {
        try {
            await request(app).post('/tax-return').send({
                property_id: "1",
                fiscalYear: 23,
                numberOfDaysRented: 365,
                previousYearsImprovements: 0,
                currentYearImprovements: 10000
            });
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('fiscalYear must be a valid year');
        }
    });

    test("Calculate tax return KO - Invalid number of days rented", async () => {
        try {
            await request(app).post('/tax-return').send({
                property_id: "1",
                fiscalYear: 2023,
                numberOfDaysRented: 400,
                previousYearsImprovements: 0,
                currentYearImprovements: 10000
            });
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toStrictEqual('numberOfDaysRented must be between 0 and 365');
        }
    });

    test("Calculate tax return KO - Forbidden", async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this property'));

        try {
            await request(app).post('/tax-return').send({
                property_id: "1",
                fiscalYear: 2023,
                numberOfDaysRented: 365,
                previousYearsImprovements: 0,
                currentYearImprovements: 10000
            });
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.message).toStrictEqual('You are not allowed to perform this operation on this property');
        }
    });

    test("Calculate tax return KO - Property not found", async () => {
        propertyService.validatePropertyOwnership.mockRejectedValue(new NotFoundError('Property not found'));

        try {
            await request(app).post('/tax-return').send({
                property_id: "1",
                fiscalYear: 2023,
                numberOfDaysRented: 365,
                previousYearsImprovements: 0,
                currentYearImprovements: 10000
            });
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toStrictEqual('Property not found');
        }
    });
});