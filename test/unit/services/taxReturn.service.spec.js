const TaxReturn = require('../../../src/models/taxReturn.model');
const balanceService = require('../../../src/services/balance.service');
const propertyService = require('../../../src/services/property.service');
const taxReturnService = require('../../../src/services/taxReturn.service');
const { ValidationError } = require("sequelize");

jest.mock('../../../src/services/balance.service');
jest.mock('../../../src/services/property.service');
jest.mock('../../../src/models/taxReturn.model');

describe('TaxReturn Service', () => {
    const mockProperty = {
        propertyName: 'Property 1',
        property_id: '1',
        address: 'Calle Falsa 123',
        cadastralReference: '12345678A',
        cadastralValue: 145000,
        constructionValue: 40000,
        acquisitionValue: 225000,
        acquisitionCosts: 25000,
        flatDetails: {
            numberOfRooms: 2,
            floorNumber: 1,
            hasBalcony: true
        }
    }

    test('calculateAmortization', async () => {
        const mockNumberOfDaysRented = 365;

        propertyService.readProperty.mockResolvedValue(mockProperty);
        const amortization = await taxReturnService.calculateAmortization(mockProperty.property_id, mockNumberOfDaysRented);
        expect(amortization).toBe(2068.97);
    });

    test('calculateAmortization - incomplete property data', async () => {
        const mockPropertyNoAcquisitionCosts = {
            propertyName: 'Property 1',
            property_id: '1',
            address: 'Calle Falsa 123',
            cadastralReference: '12345678A',
            cadastralValue: 145000,
            constructionValue: 40000,
            acquisitionValue: 225000,
            acquisitionCosts: null,
            flatDetails: {
                numberOfRooms: 2,
                floorNumber: 1,
                hasBalcony: true
            }
        }
        const mockNumberOfDaysRented = 365;

        propertyService.readProperty.mockResolvedValue(mockPropertyNoAcquisitionCosts);
        try {
            await taxReturnService.calculateAmortization(mockProperty.property_id, mockNumberOfDaysRented);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Property data is incomplete');
        }
    });

    test('calculateTaxReturn', async () => {
        const mockBody = {
            property_id: '1',
            fiscalYear: 2023,
            numberOfDaysRented: 365
        };

        const mockBalance = {
            income: 20000,
            expenses: 4000
        };

        const mockAmortization = 2068.97;

        balanceService.calculateBalanceInRange.mockResolvedValue(mockBalance);
        propertyService.readProperty.mockResolvedValue(mockProperty);

        TaxReturn.mockImplementation((taxReturnData) => ({
            ...taxReturnData,
            save: jest.fn().mockResolvedValue(taxReturnData)
        }));

        const taxReturn = await taxReturnService.calculateTaxReturn(mockBody);

        expect(taxReturn.property_id).toBe(mockBody.property_id);
        expect(taxReturn.fiscalYear).toBe(mockBody.fiscalYear);
        expect(taxReturn.taxableIncome).toBe(mockBalance.income);
        expect(taxReturn.deductibleExpenses).toBe(mockBalance.expenses);
        expect(taxReturn.amortization).toBe(mockAmortization);
    });
});
