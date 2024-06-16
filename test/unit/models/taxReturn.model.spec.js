const SequelizeMock = require('sequelize-mock');
const TaxReturn = require('../../../src/models/taxReturn.model.js');

const DBConnectionMock = new SequelizeMock();

const TaxReturnMock = DBConnectionMock.define('TaxReturn', {
    taxReturn_id: '1',
    fiscalYear: 2023,
    taxableIncome: 20000,
    deductibleExpenses: 4000,
    amortization: 2068.97,
    property_id: '1'
});

TaxReturnMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
    if (query === 'create') {
        return TaxReturnMock.build(queryOptions);
    }
});

describe('Tax Return Model', () => {
    test('Save tax return', async () => {
        const mockTaxReturn = {
            fiscalYear: 2023,
            taxableIncome: 20000,
            deductibleExpenses: 4000,
            amortization: 2068.97,
            property_id: '1'
        };
        const createdTaxReturn = await TaxReturnMock.create(mockTaxReturn);
        expect(createdTaxReturn.fiscalYear).toBe(mockTaxReturn.fiscalYear);
        expect(createdTaxReturn.taxableIncome).toBe(mockTaxReturn.taxableIncome);
        expect(createdTaxReturn.deductibleExpenses).toBe(mockTaxReturn.deductibleExpenses);
        expect(createdTaxReturn.amortization).toBe(mockTaxReturn.amortization);
        expect(createdTaxReturn.property_id).toBe(mockTaxReturn.property_id);
    });
});