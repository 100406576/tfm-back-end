const balanceService = require('../services/balance.service');
const { ValidationError } = require('sequelize');
const propertyService = require('../services/property.service');

const createBalance = async (req, res, next) => {
    try {
        let { property_id, dateRange, timeInterval } = req.body;

        validateRequest(property_id, dateRange, timeInterval);
        await propertyService.validatePropertyOwnership(property_id, req.user.user_id)
        dateRange.startDate = new Date(dateRange.startDate);
        dateRange.endDate = new Date(dateRange.endDate);

        const balance = await balanceService.calculateBalanceForInterval(property_id, dateRange, timeInterval);

        res.status(201).json(balance);
    } catch (error) {
        next(error);
    }

}

const validateRequest = (property_id, dateRange, timeInterval) => {
    if (!property_id || !dateRange || timeInterval === undefined || !dateRange.startDate || !dateRange.endDate) {
        throw new ValidationError('Missing required fields');
    }

    if (typeof timeInterval !== 'number' || timeInterval < 0) {
        throw new ValidationError('Invalid time interval');
    }
}

module.exports = {
    createBalance
}
