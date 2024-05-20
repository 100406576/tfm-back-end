const Operation = require('../models/operation.model');


const readOperationsByPropertyId = async function (property_id) {
    return await Operation.findAll({
        where: {
            property_id: property_id
        }
    });
}

const readOperation = async function (operation_id) {
    return await Operation.findByPk(operation_id);
}

const createOperation = async function (operation) {
    return await Operation.create(operation);
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
    readOperation,
    createOperation,
    deleteOperation
}