const Property = require('../models/property.model');
const House = require('../models/house.model');
const Flat = require('../models/flat.model');
const Garage = require('../models/garage.model');
const NotFoundError = require('../errors/notFound.error.js');
const ForbiddenError = require('../errors/forbidden.error.js');

const cleanPropertyDetails = (property) => {
    if (property === null) {
        return null;
    }

    const propertyObject = property.toJSON();
    if (!propertyObject.houseDetails) delete propertyObject.houseDetails;
    if (!propertyObject.flatDetails) delete propertyObject.flatDetails;
    if (!propertyObject.garageDetails) delete propertyObject.garageDetails;
    return propertyObject;
};

const readPropertiesByUserId = async function (user_id) {
    const properties = await Property.findAll({
        where: { user_id: user_id },
        include: [
            { model: House, as: 'houseDetails' },
            { model: Flat, as: 'flatDetails' },
            { model: Garage, as: 'garageDetails' },
        ],
    });

    const cleanedProperties = properties.map(cleanPropertyDetails);

    return cleanedProperties;
};

const readProperty = async function (property_id) {
    const property = await Property.findByPk(property_id, {
        include: [
            { model: House, as: 'houseDetails' },
            { model: Flat, as: 'flatDetails' },
            { model: Garage, as: 'garageDetails' },
        ],
    });
    return cleanPropertyDetails(property);
}

const createProperty = async function (property) {

    const createdProperty = await Property.create({
        propertyName: property.propertyName,
        address: property.address,
        cadastralReference: property.cadastralReference,
        user_id: property.user_id,
        cadastralValue: property.cadastralValue,
        constructionValue: property.constructionValue,
        acquisitionValue: property.acquisitionValue,
        acquisitionCosts: property.acquisitionCosts,
    });

    if (property.houseDetails) {
        await House.create({
            property_id: createdProperty.property_id,
            ...property.houseDetails
        });
    }

    if (property.flatDetails) {
        await Flat.create({
            property_id: createdProperty.property_id,
            ...property.flatDetails
        });
    }

    if (property.garageDetails) {
        await Garage.create({
            property_id: createdProperty.property_id,
            ...property.garageDetails
        });
    }

    return await readProperty(createdProperty.property_id);
}

const updateProperty = async function (property_id, property) {
    await Property.update({
        propertyName: property.propertyName,
        address: property.address,
        cadastralReference: property.cadastralReference,
        cadastralValue: property.cadastralValue,
        constructionValue: property.constructionValue,
        acquisitionValue: property.acquisitionValue,
        acquisitionCosts: property.acquisitionCosts,
    }, {
        where: {
            property_id: property_id
        }
    });

    if (property.houseDetails) {
        await House.update({
            ...property.houseDetails
        }, {
            where: {
                property_id: property_id
            }
        });
    }

    if (property.flatDetails) {
        await Flat.update({
            ...property.flatDetails
        }, {
            where: {
                property_id: property_id
            }
        });
    }

    if (property.garageDetails) {
        await Garage.update({
            ...property.garageDetails
        }, {
            where: {
                property_id: property_id
            }
        });
    }

    return await readProperty(property_id);
}

const deleteProperty = async function (property_id) {
    return await Property.destroy({
        where: {
            property_id: property_id
        }
    });
}

const validatePropertyOwnership = async (property_id, user_id) => {
    const property = await readProperty(property_id);

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    if (property.user_id !== user_id) {
        throw new ForbiddenError('You are not allowed to perform this operation on this property');
    }
}

module.exports = {
    readPropertiesByUserId,
    readProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    validatePropertyOwnership,
};
