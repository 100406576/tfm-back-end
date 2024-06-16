const propertyService = require('../services/property.service');
const taxService = require('../services/taxReturn.service');
const { ValidationError } = require('sequelize')

const calculateTaxReturn = async (req, res, next) => {
    try {
        const body = req.body;

        validateRequest(body);
        await propertyService.validatePropertyOwnership(body.property_id, req.user.user_id);

        const taxReturn = await taxService.calculateTaxReturn(body);

        res.status(200).json(taxReturn);
    } catch (error) {
        next(error);
    }
}

function validateRequest(body) {
    const requiredFields = ['property_id', 'fiscalYear', 'numberOfDaysRented'];

    requiredFields.forEach(field => {
        if (!body.hasOwnProperty(field)) {
            throw new ValidationError(`${field} is required`);
        }
    });

    if (!/^\d{4}$/.test(body.fiscalYear)) {
        throw new ValidationError('fiscalYear must be a valid year');
    }

    if(body.numberOfDaysRented < 0 || body.numberOfDaysRented > 365) {
        throw new ValidationError('numberOfDaysRented must be between 0 and 365');
    }
}

module.exports = {
    calculateTaxReturn
}
