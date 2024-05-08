const { sequelize, ValidationError } = require('sequelize');
const userService = require('../services/user.service.js');
const propertyService = require('../services/property.service.js');
const NotFoundError = require('../errors/notFound.error.js');
const ForbiddenError = require('../errors/forbidden.error.js');

const readPropertiesOfUser = async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await userService.readUser(username);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const properties = await propertyService.readPropertiesByUserId(user.user_id);

        res.status(200).json(properties);
    } catch (error) {
        next(error);
    }
};

const readProperty = async (req, res, next) => {
    try {
        const property_id = req.params.property_id;
        const property = await propertyService.readProperty(property_id);

        if (!property) {
            throw new NotFoundError('Property not found');
        }

        if(property.user_id !== req.user.user_id) {
            throw new ForbiddenError('You are not allowed to see this property');
        }

        res.status(200).json(property);
    } catch (error) {
        next(error);
    }
};

const createProperty = async (req, res, next) => {
    try {
        const username = req.params.username;
        const property = req.body;
        const user = await userService.readUser(username);

        if (await propertyService.readProperty(property.property_id)) {
            throw new ValidationError('Property already exists');
        }
        
        property.user_id = user.user_id;

        const newProperty = await propertyService.createProperty(property);

        res.status(201).json(newProperty);
    } catch (error) {
        next(error);
    }
};

const deleteProperty = async (req, res, next) => {
    try {
        const property_id = req.params.property_id;
        const property = await propertyService.readProperty(property_id);

        if (!property) {
            throw new NotFoundError('Property not found');
        }

        if(property.user_id !== req.user.user_id) {
            throw new ForbiddenError('You are not allowed to delete this property');
        }

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
    deleteProperty
}