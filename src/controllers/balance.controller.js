const balanceService = require('../services/balance.service');
const { ValidationError } = require('sequelize');
const propertyService = require('../services/property.service');

const validateRequest = (property_id, dateRange, timeInterval, req) => {
    if (!property_id || !dateRange || timeInterval === undefined || !dateRange.startDate || !dateRange.endDate) {
        throw new ValidationError('Missing required fields');
    }

    if (typeof timeInterval !== 'number' || timeInterval < 0) {
        throw new ValidationError('Invalid time interval');
    }
}

const createBalance = async (req, res, next) => {
    try {
        let { property_id, dateRange, timeInterval } = req.body;

        const interval = validateRequest(property_id, dateRange, timeInterval, req);
        await propertyService.validatePropertyOwnership(property_id, req.user.user_id)
        dateRange.startDate = new Date(dateRange.startDate);
        dateRange.endDate = new Date(dateRange.endDate);

        const balance = await balanceService.calculateBalanceForInterval(property_id, dateRange, timeInterval);

        res.status(201).json(balance);
    } catch (error) {
        next(error);
    }

}

module.exports = {
    createBalance
}