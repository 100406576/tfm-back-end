const operationService = require('../../../src/services/operation.service');
const Operation = require('../../../src/models/operation.model');

jest.mock('../../../src/models/operation.model', () => {
    return {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };
});

describe('Property Service', () => {
    const operation = { id: 1, description: "Mensualidad abril 2024", date: new Date().toISOString(), type: 'income', value: 900.00, property_id: 1 }

    beforeEach(() => {
        Operation.findAll.mockClear();
        Operation.findByPk.mockClear();
    });

    test('readOperationsByPropertyId', async () => {
        const property_id = 1;
        const operations = [operation,
        { id: 2, description: "Gas abril 2024", date: new Date().toISOString(), type: 'expense', value: -40.00, property_id: 1 }];
        Operation.findAll.mockResolvedValue(operations);

        const result = await operationService.readOperationsByPropertyId(property_id);
        expect(result).toEqual(operations);
        expect(Operation.findAll).toHaveBeenCalledWith({ where: { property_id: property_id } });
    });

    test('readOperation', async () => {
        const operation_id = 1;
        Operation.findByPk.mockResolvedValue(operation);

        const result = await operationService.readOperation(operation_id);
        expect(result).toEqual(operation);
        expect(Operation.findByPk).toHaveBeenCalledWith(operation_id);
    });

    test('createOperation', async () => {
        Operation.create.mockResolvedValue(operation);

        const result = await operationService.createOperation(operation);
        expect(result).toEqual(operation);
        expect(Operation.create).toHaveBeenCalledWith(operation);
    });

    test('updateOperation', async () => {
        const operation_id = 1;
        const operationUpdate = { id: 1, description: "Mensualidad abril 2024", date: new Date().toISOString(), type: 'expense', value: -900.00, property_id: 1 }
        Operation.update.mockResolvedValue(1);
        Operation.findByPk.mockResolvedValue(operationUpdate);

        const result = await operationService.updateOperation(operation_id, operationUpdate);
        expect(result).toEqual(operationUpdate);
        expect(Operation.update).toHaveBeenCalledWith(operationUpdate, { where: { operation_id: operation_id } });
        expect(Operation.findByPk).toHaveBeenCalledWith(operation_id);
    });

    test('deleteOperation', async () => {
        const operation_id = 1;
        Operation.destroy.mockResolvedValue(1);

        const result = await operationService.deleteOperation(operation_id);
        expect(result).toEqual(1);
        expect(Operation.destroy).toHaveBeenCalledWith({ where: { operation_id: operation_id } });
    });
});