const operationService = require('../../../src/services/operation.service');
const Balance = require('../../../src/models/balance.model');
const balanceService = require('../../../src/services/balance.service');

jest.mock('../../../src/services/operation.service');
jest.mock('../../../src/models/balance.model');

describe('Balance Service', () => {
    test('calculateBalanceForInterval- interlval 0', async () => {
        const mockPropertyId = '1';
        const mockDateRange = {
            startDate: new Date('2022-01-01'),
            endDate: new Date('2022-12-31')
        };
        const mockInterval = 0;

        const mockOperations = [
            { type: 'income', value: '100' },
            { type: 'expense', value: '50' }
        ];

        operationService.readOperationsByPropertyIdAndDateRange.mockResolvedValue(mockOperations);
        Balance.mockImplementation((balanceData) => ({
            ...balanceData,
            save: jest.fn().mockResolvedValue(balanceData)
        }));

        const balance = await balanceService.calculateBalanceForInterval(mockPropertyId, mockDateRange, mockInterval);

        expect(balance.labels).toEqual([`${mockDateRange.startDate.toLocaleDateString()}-${mockDateRange.endDate.toLocaleDateString()}`]);
        expect(balance.income).toEqual([100]);
        expect(balance.expenses).toEqual([50]);
        expect(balance.property_id).toBe(mockPropertyId);
    });

    test('calculateBalanceForInterval with 1', async () => {
        const mockPropertyId = '1';
        const mockDateRange = {
            startDate: new Date('2022-01-01'),
            endDate: new Date('2022-12-31')
        };
        const mockInterval = 1;
    
        const mockOperations = [
            { type: 'income', value: '100' },
            { type: 'expense', value: '50' }
        ];
    
        operationService.readOperationsByPropertyIdAndDateRange.mockResolvedValue(mockOperations);
        Balance.mockImplementation((balanceData) => ({
            ...balanceData,
            save: jest.fn().mockResolvedValue(balanceData)
        }));
    
        const balance = await balanceService.calculateBalanceForInterval(mockPropertyId, mockDateRange, mockInterval);
    
        expect(balance.labels.length).toBe(12);
        expect(balance.income.length).toBe(12);
        expect(balance.expenses.length).toBe(12);
        expect(balance.property_id).toBe(mockPropertyId);
    });
});