const propertyService = require('../services/property.service.js');

const readPropertiesOfUser = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;

        const properties = await propertyService.readPropertiesByUserId(user_id);

        res.status(200).json(properties);
    } catch (error) {
        next(error);
    }
};

const readProperty = async (req, res, next) => {
    try {
        const property_id = req.params.property_id;
        await propertyService.validatePropertyOwnership(property_id, req.user.user_id);

        const property = await propertyService.readProperty(property_id);
        res.status(200).json(property);
    } catch (error) {
        next(error);
    }
};

const createProperty = async (req, res, next) => {
    try {
        const property = req.body;
        property.user_id = req.user.user_id;

        const newProperty = await propertyService.createProperty(property);

        res.status(201).json(newProperty);
    } catch (error) {
        next(error);
    }
};

const editProperty = async (req, res, next) => {
    try {
        const property_id = req.params.property_id;
        await propertyService.validatePropertyOwnership(property_id, req.user.user_id);

        const updatedProperty = await propertyService.updateProperty(property_id, req.body);

        res.status(200).json(updatedProperty);
    } catch (error) {
        next(error);
    }
};

const deleteProperty = async (req, res, next) => {
    try {
        const property_id = req.params.property_id;
        await propertyService.validatePropertyOwnership(property_id, req.user.user_id);

        await propertyService.deleteProperty(property_id);

        res.status(200).send({ message: 'Property deleted'});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    readPropertiesOfUser,
    readProperty,
    createProperty,
    editProperty,
    deleteProperty
}