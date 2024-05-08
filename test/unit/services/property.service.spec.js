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
        create: jest.fn(),
        destroy: jest.fn(),
    };
});
jest.mock('../../../src/models/house.model', () => {
    return {
        create: jest.fn(),
    };
});
jest.mock('../../../src/models/flat.model', () => {
    return {
        create: jest.fn(),
    };
});
jest.mock('../../../src/models/garage.model', () => {
    return {
        create: jest.fn(),
    };
});

describe('Property Service', () => {
    beforeEach(() => {
        Property.findAll.mockClear();
        Property.hasOne.mockClear();
        Property.findByPk.mockClear();
        Property.create.mockClear();
        Property.destroy.mockClear();
        House.create.mockClear();
        Flat.create.mockClear();
        Garage.create.mockClear();
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

    test('Create property House', async () => {
        const mockProperty = {
            propertyName: "Casa 1",
            address: "Calle inventada 2, Bajo A",
            cadastralReference: "1234",
            user_id: "1",
            houseDetails: {
                numberOfRooms: 2,
                hasGarden: false
            }
        };
        const createdProperty = {
            property_id: "1",
            propertyName: "Casa 1",
            address: "Calle inventada 2, Bajo A",
            cadastralReference: "1234",
            user_id: "1",
            houseDetails: {
                numberOfRooms: 2,
                hasGarden: false,
                property_id: "1"
            },
            toJSON: function () {
                return this;
            }
        };
        Property.create.mockResolvedValueOnce(createdProperty);
        House.create.mockResolvedValueOnce(createdProperty.houseDetails);

        const property = await propertyService.createProperty(mockProperty);

        expect(property).toEqual(createdProperty);
    });

    test('Create property Flat', async () => {
const mockProperty = {
            propertyName: "Piso 1",
            address: "Calle inventada 2, Bajo A",
            cadastralReference: "1234",
            user_id: "1",
            flatDetails: {
                floor: 1,
                hasBalcony: true,
                numberOfRooms: 3
            }
        };
        const createdProperty = {
            property_id: "1",
            propertyName: "Piso 1",
            address: "Calle inventada 2, Bajo A",
            cadastralReference: "1234",
            user_id: "1",
            flatDetails: {
                floor: 1,
                hasBalcony: true,
                numberOfRooms: 3,
                property_id: "1"
            },
            toJSON: function () {
                return this;
            }
        };
        Property.create.mockResolvedValueOnce(createdProperty);

        const property = await propertyService.createProperty(mockProperty);

        expect(property).toEqual(createdProperty);
    });

    test('Create property Garage', async () => {
        const mockProperty = {
            propertyName: "Garaje 1",
            address: "Calle inventada 2, Bajo A",
            cadastralReference: "1234",
            user_id: "1",
            garageDetails: {
                hasStorage: true,
                hasAutomaticDoor: true
            }
        };
        const createdProperty = {
            property_id: "1",
            propertyName: "Garaje 1",
            address: "Calle inventada 2, Bajo A",
            cadastralReference: "1234",
            user_id: "1",
            garageDetails: {
                capacity: 1,
                isPrivate: true,
                property_id: "1"
            },
            toJSON: function () {
                return this;
            }
        };
        Property.create.mockResolvedValueOnce(createdProperty);

        const property = await propertyService.createProperty(mockProperty);

        expect(property).toEqual(createdProperty);
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