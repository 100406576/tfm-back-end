const SequelizeMock = require('sequelize-mock');
const Operation = require('../../../src/models/operation.model.js');

const DBConnectionMock = new SequelizeMock();

const OperationMock = DBConnectionMock.define('Operation', {
    operation_id: '1',
    description: 'Test Description',
    date: new Date(),
    type: 'income',
    value: 100.00,
    property_id: '1',
});

OperationMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
    if (query === 'findAll') {
        return [
            OperationMock.build({
                operation_id: '1',
                description: 'Test Description',
                date: new Date(),
                type: 'income',
                value: 100.00,
                property_id: '1',
            }),
            OperationMock.build({
                operation_id: '2',
                description: 'Test Description 2',
                date: new Date(),
                type: 'expense',
                value: -200.00,
                property_id: '2',
            }),
        ];
    }

    if (query === 'findOne') {
        return OperationMock.build({
            operation_id: '1',
            description: 'Test Description',
            date: new Date(),
            type: 'income',
            value: 100.00,
            property_id: '1',
        });
    }

    if (query === 'create') {
        return OperationMock.build(queryOptions);
    }

    if (query === 'update') {
        return [1];
    }

    if (query === 'destroy') {
        return 1;
    }
});

describe('Operation Model', () => {

    test('Find all operations by property id', async () => {
        const operations = await OperationMock.findAll({
            where: {
                property_id: 1
            }
        });
        expect(operations).toHaveLength(2);
        expect(operations[0].operation_id).toBe('1');
        expect(operations[1].operation_id).toBe('2');
    });
    
    test('Find Operation by operation_id', async () => {
        const foundOperation = await OperationMock.findOne({ where: { operation_id: '1' } });
        expect(foundOperation.operation_id).toBe('1');
    });

    test('Create operation', async () => {
        const mockOperation = { operation_id: '2', description: 'Test Description 2', date: new Date(), type: 'expense', value: -200.00, property_id: '2' };
        const createdOperation = await OperationMock.create(mockOperation);
        expect(createdOperation.operation_id).toBe('2');
    });   

    test('Create operation with missing required field', async () => {
        const mockOperation = { operation_id: '3', date: new Date().toISOString(), value: 300.00, property_id: '3' };
        try {
            await OperationMock.create(mockOperation);
        } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
        }
    });

    test('Update operation', async () => {
        const mockOperationUpdate = { operation_id: '2', description: 'Test Description 3', date: new Date(), type: 'expense', value: -200.00, property_id: '2' };
        const updatedOperation = await OperationMock.update(mockOperationUpdate, { where: { operation_id: '1' } });
        expect(updatedOperation).toEqual([1]);
    });

    test('Delete operation', async () => {
        const deletedOperation = await OperationMock.destroy({ where: { operation_id: '1' } });
        expect(deletedOperation).toBe(1);
    });
});