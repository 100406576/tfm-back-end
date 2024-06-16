const operationService = require('./operation.service');
const Balance = require('../models/balance.model');

const calculateBalanceForInterval = async (property_id, dateRange, interval) => {
    let labels = [];
    let incomeArray = [];
    let expensesArray = [];

    if (interval === 0) {
        const { income, expenses } = await calculateBalanceInRange(property_id, dateRange.startDate, dateRange.endDate);
        const startDateFormatted = dateRange.startDate.toLocaleDateString();
        const endDateFormatted = dateRange.endDate.toLocaleDateString();
        labels.push(`${startDateFormatted}-${endDateFormatted}`);
        incomeArray.push(income);
        expensesArray.push(expenses);
    } else {
        while (dateRange.startDate < dateRange.endDate) {
            const startDateFormatted = dateRange.startDate.toLocaleDateString();
            const endDate = new Date(dateRange.startDate);
            endDate.setMonth(dateRange.startDate.getMonth() + interval);
            endDate.setDate(endDate.getDate() - 1);
            const endDateFormatted = endDate.toLocaleDateString();
            labels.push(`${startDateFormatted}-${endDateFormatted}`);
            const { income, expenses } = await calculateBalanceInRange(property_id, dateRange.startDate, endDate);
            incomeArray.push(income);
            expensesArray.push(expenses);
            dateRange.startDate.setMonth(dateRange.startDate.getMonth() + interval);
        }
    }

    const balance = new Balance({
        labels: labels,
        income: incomeArray,
        expenses: expensesArray,
        property_id: property_id
    });

    await balance.save();

    return balance;
}

const calculateBalanceInRange = async (property_id, startDate, endDate) => {
    const operations = await operationService.readOperationsByPropertyIdAndDateRange(property_id, startDate, endDate);
    let income = 0;
    let expenses = 0;
    for (let operation of operations) {
        const value = parseFloat(operation.value);
        if (operation.type === 'income') {
            income += value;
        } else if (operation.type === 'expense') {
            expenses += value;
        }
    }
    return { income, expenses };
}

module.exports = {
    calculateBalanceForInterval,
    calculateBalanceInRange
}
