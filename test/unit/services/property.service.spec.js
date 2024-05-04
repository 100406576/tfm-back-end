const Property = require('../../../src/models/property.model');
const House = require('../../../src/models/house.model');
const Flat = require('../../../src/models/flat.model');
const Garage = require('../../../src/models/garage.model');
const propertyService = require('../../../src/services/property.service');

jest.mock('../../../src/models/property.model', () => {
    return {
        findAll: jest.fn(),
        hasOne: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    };
});
jest.mock('../../../src/models/house.model', () => {
    return jest.fn();
});
jest.mock('../../../src/models/flat.model', () => {
    return jest.fn();
});
jest.mock('../../../src/models/garage.model', () => {
    return jest.fn();
});

describe('Property Service', () => {
    beforeEach(() => {
        Property.findAll.mockClear();
        Property.hasOne.mockClear();
        Property.findByPk.mockClear();
        Property.destroy.mockClear();
        House.mockClear();
        Flat.mockClear();
        Garage.mockClear();
    });

    test('Return properties by user id', async () => {
        const mockProperties = [
            {
                property_id: '1', propertyName: 'Test Property 1', user_id: '1', houseDetails: { property_id: '1', numberOfRooms: 2, hasGarden: true }, toJSON: function () {
                    return this;
                }
            },
            {
                property_id: '2', propertyName: 'Test Property 2', user_id: '1', flatDetails: { property_id: '2', floor: 1, hasBalcony: false, numberOfRooms: 3 }, toJSON: function () {
                    return this;
                }
            },
        ];
        Property.findAll.mockResolvedValueOnce(mockProperties);

        const properties = await propertyService.readPropertiesByUserId('1');

        expect(properties).toEqual(mockProperties);
        expect(Property.findAll).toHaveBeenCalledWith({
            where: { user_id: '1' },
            include: [
                { model: House, as: 'houseDetails' },
                { model: Flat, as: 'flatDetails' },
                { model: Garage, as: 'garageDetails' },
            ],
        });
    });

    test('Read property by id', async () => {
        const mockProperty = {
            property_id: '1', propertyName: 'Test Property 1', user_id: '1', houseDetails: { property_id: '1', numberOfRooms: 2, hasGarden: true }, toJSON: function () {
                return this;
            }
        };
        Property.findByPk.mockResolvedValueOnce(mockProperty);

        const property = await propertyService.readProperty('1');

        expect(property).toEqual(mockProperty);
        expect(Property.findByPk).toHaveBeenCalledWith('1', {
            include: [
                { model: House, as: 'houseDetails' },
                { model: Flat, as: 'flatDetails' },
                { model: Garage, as: 'garageDetails' },
            ],
        });
    });

    test('Delete property by id', async () => {
        Property.destroy.mockResolvedValueOnce(1);

        const res = await propertyService.deleteProperty('1');

        expect(res).toBe(1);
        expect(Property.destroy).toHaveBeenCalledWith({
            where: {
                property_id: '1'
            }
        });
    });

    test('Delete property by id - Property not found', async () => {
        Property.destroy.mockResolvedValueOnce(0);

        const res = await propertyService.deleteProperty('1');

        expect(res).toBe(0);
        expect(Property.destroy).toHaveBeenCalledWith({
            where: {
                property_id: '1'
            }
        });
    });
});