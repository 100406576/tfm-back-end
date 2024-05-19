const operationService = require('../../../src/services/operation.service');
const Operation = require('../../../src/models/operation.model');

jest.mock('../../../src/models/operation.model', () => {
    return {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    };
});

describe('Property Service', () => {
    beforeEach(() => {
        Operation.findAll.mockClear();
        Operation.findByPk.mockClear();
    });

    test('readOperationsByPropertyId', async () => {
        const property_id = 1;
        const operations = [{ id: 1, description: "Mensualidad abril 2024", date: new Date().toISOString(), type: 'income', value: 900.00, property_id: 1 },
        { id: 2, description: "Gas abril 2024", date: new Date().toISOString(), type: 'expense', value: -40.00, property_id: 1 }];
        Operation.findAll.mockResolvedValue(operations);

        const result = await operationService.readOperationsByPropertyId(property_id);
        expect(result).toEqual(operations);
        expect(Operation.findAll).toHaveBeenCalledWith({ where: { property_id: property_id } });
    });

    test('readOperation', async () => {
        const operation_id = 1;
        const operation = { id: 1, description: "Mensualidad abril 2024", date: new Date().toISOString(), type: 'income', value: 900.00, property_id: 1 };
        Operation.findByPk.mockResolvedValue(operation);

        const result = await operationService.readOperation(operation_id);
        expect(result).toEqual(operation);
        expect(Operation.findByPk).toHaveBeenCalledWith(operation_id);
    });

    test('createOperation', async () => {
        const operation = { id: 1, description: "Mensualidad abril 2024", date: new Date().toISOString(), type: 'income', value: 900.00, property_id: 1 }
        Operation.create.mockResolvedValue(operation);

        const result = await operationService.createOperation(operation);
        expect(result).toEqual(operation);
        expect(Operation.create).toHaveBeenCalledWith(operation);
    });
});