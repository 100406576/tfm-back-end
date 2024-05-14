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

module.exports = {
    readOperationsByPropertyId,
    readOperation
}