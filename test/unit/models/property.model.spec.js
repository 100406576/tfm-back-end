const SequelizeMock = require('sequelize-mock');
const Property = require('../../../src/models/property.model.js');

const DBConnectionMock = new SequelizeMock();

const PropertyMock = DBConnectionMock.define('Property', {
    property_id: '1',
    propertyName: 'Test Property',
    address: '123 Test St',
    cadastralReference: '1234567890',
    user_id: '1',
});

PropertyMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
    if (query === 'findAll') {
        return [
            PropertyMock.build({
                property_id: '1',
                propertyName: 'Test Property',
                address: '123 Test St',
                cadastralReference: '1234567890',
                user_id: '1',
            }),
            PropertyMock.build({
                property_id: '2',
                propertyName: 'Test Property 2',
                address: '456 Test St',
                cadastralReference: '0987654321',
                user_id: '2',
            }),
        ];
    }

    if (query === 'findOne') {
        return PropertyMock.build({
            property_id: '1',
            propertyName: 'Test Property',
            address: '123 Test St',
            cadastralReference: '1234567890',
            user_id: '1',
        });
    }

    if (query === 'create') {
        return PropertyMock.build(queryOptions);
    }

    if (query === 'update') {
        return [1];
    }

    if (query === 'destroy') {
        return 1;
    }
});

describe('Property Model', () => {

    test('Find all properties', async () => {
        const properties = await PropertyMock.findAll();
        expect(properties).toHaveLength(2);
        expect(properties[0].property_id).toBe('1');
        expect(properties[1].property_id).toBe('2');
    });
    
    test('Find Property by property_id', async () => {
        const foundProperty = await PropertyMock.findOne({ where: { property_id: '1' } });
        expect(foundProperty.property_id).toBe('1');
    });

    test('Create property', async () => {
        const mockProperty = { property_id: '2', propertyName: 'Test Property 2', address: '456 Test St', cadastralReference: '0987654321', user_id: '2' };
        const createdProperty = await PropertyMock.create(mockProperty);
        expect(createdProperty.property_id).toBe('2');
    });   

    test('Create property with missing required field', async () => {
        const mockProperty = { property_id: '3', address: '789 Test St', cadastralReference: '0987654321', user_id: '3' };
        try {
            await PropertyMock.create(mockProperty);
        } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
        }
    });

    /*test('Update property', async () => {
        const dataProperty = { propertyName: 'Updated Property Name' };
        const property_id = '1';
        const affectedRows = await PropertyMock.update(dataProperty, { where: { property_id: property_id } });
        expect(affectedRows[0]).toBe(1);
    });*/
    
    test('Delete property', async () => {
        const deletedProperty = await PropertyMock.destroy({ where: { property_id: '1' } });
        expect(deletedProperty).toBe(1);
    });
});