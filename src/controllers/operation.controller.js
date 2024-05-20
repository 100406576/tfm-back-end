const { sequelize, ValidationError } = require('sequelize');
const userService = require('../services/user.service.js');
const propertyService = require('../services/property.service.js');
const operationService = require('../services/operation.service.js');
const NotFoundError = require('../errors/notFound.error.js');
const ForbiddenError = require('../errors/forbidden.error.js');


const readOperationsOfProperty = async (req, res, next) => {
    try {
        const property_id = req.params.property_id;
        await validatePropertyOwnership(property_id, req.user.user_id);

        const operations = await operationService.readOperationsByPropertyId(property_id);

        res.status(200).json(operations);
    } catch (error) {
        next(error);
    }
}

const readOperation = async (req, res, next) => {
    try {
        const operation_id = req.params.operation_id;
        const operation = await operationService.readOperation(operation_id);

        if (!operation) {
            throw new NotFoundError('Operation not found');
        }

        await validatePropertyOwnership(operation.property_id, req.user.user_id);

        res.status(200).json(operation);
    } catch (error) {
        next(error);
    }
}

const createOperation = async (req, res, next) => {
    try {
        const body = req.body;

        if(!body.property_id) {
            throw new ValidationError('property_id is required');
        }

        await validatePropertyOwnership(body.property_id, req.user.user_id);

        const operation = await operationService.createOperation(body);
        res.status(201).json(operation);
    } catch (error) {
        next(error);
    }
}

const deleteOperation = async (req, res, next) => {
    try {
        const operation_id = req.params.operation_id;
        const operation = await operationService.readOperation(operation_id);

        if (!operation) {
            throw new NotFoundError('Operation not found');
        }

        await validatePropertyOwnership(operation.property_id, req.user.user_id);

        await operationService.deleteOperation(operation_id);
        res.status(200).send({ message: 'Operation deleted' });
    } catch (error) {
        next(error);
    }
}

const validatePropertyOwnership = async (property_id, user_id) => {
    const property = await propertyService.readProperty(property_id);

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    if (property.user_id !== user_id) {
        throw new ForbiddenError('You are not allowed to perform this operation on this property');
    }

    return property;
}

module.exports = {
    readOperationsOfProperty,
    readOperation,
    createOperation,
    deleteOperation
}