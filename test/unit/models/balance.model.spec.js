const SequelizeMock = require('sequelize-mock');
const Balance = require('../../../src/models/balance.model.js');

// Setup the mock database connection
const DBConnectionMock = new SequelizeMock();

// Mocks the Balance model
const BalanceMock = DBConnectionMock.define('Balance', {
    balance_id: '1',
    labels: JSON.stringify(['label1', 'label2']),
    income: JSON.stringify([100, 200]),
    expenses: JSON.stringify([50, 75]),
    property_id: '1'
});

BalanceMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
    if (query === 'create') {
        return BalanceMock.build(queryOptions);
    }
});

describe('Balance Model', () => {
    test('Save balance', async () => {
        const mockBalance = {
            labels: ['label1', 'label2'],
            income: [100, 200],
            expenses: [50, 75],
            property_id: '1'
        };
        const createdBalance = await BalanceMock.create(mockBalance);
        expect(createdBalance.labels).toEqual(mockBalance.labels);
        expect(createdBalance.income).toEqual(mockBalance.income);
        expect(createdBalance.expenses).toEqual(mockBalance.expenses);
        expect(createdBalance.property_id).toBe(mockBalance.property_id);
    });
});
