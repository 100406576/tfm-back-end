const Operation = require('../models/operation.model');
const { Op } = require("sequelize");

const readOperationsByPropertyId = async function (property_id) {
    return await Operation.findAll({
        where: {
            property_id: property_id
        }
    });
}

const readOperationsByPropertyIdAndDateRange = async function (property_id, startDate, endDate) {
    return await Operation.findAll({
        where: {
            property_id: property_id,
            date: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        }
    });
}

const readOperation = async function (operation_id) {
    return await Operation.findByPk(operation_id);
}

const createOperation = async function (operation) {
    return await Operation.create(operation);
}

const updateOperation = async function (operation_id, operation) {
    delete operation.operation_id;
    await Operation.update(operation, {
        where: {
            operation_id: operation_id
        }
    });
    return await Operation.findByPk(operation_id);
}

const deleteOperation = async function (operation_id) {
    return await Operation.destroy({
        where: {
            operation_id: operation_id
        }
    });
}

module.exports = {
    readOperationsByPropertyId,
    readOperationsByPropertyIdAndDateRange,
    readOperation,
    createOperation,
    deleteOperation,
    updateOperation
}
