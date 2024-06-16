const TaxReturn = require('../models/taxReturn.model');
const balanceService = require('./balance.service');
const propertyService = require('./property.service');

const calculateTaxReturn = async (body) => {
    const { income, expenses} = await balanceService.calculateBalanceInRange(body.property_id, new Date(body.fiscalYear, 0, 1), new Date(body.fiscalYear, 11, 31));
    const amortization = await calculateAmortization(body.property_id, body.numberOfDaysRented, body.previousYearsImprovements, body.currentYearImprovements);

    const taxReturn = new TaxReturn({
        property_id: body.property_id,
        fiscalYear: body.fiscalYear,
        taxableIncome: income,
        deductibleExpenses: expenses,
        amortization
    });

    await taxReturn.save();

    return taxReturn;
}

const calculateAmortization = async (property_id, numberOfDaysRented, previousYearsImprovements = 0, currentYearImprovements = 0) => {
    const property = await propertyService.readProperty(property_id);
    const cadastralValue = Number(property.cadastralValue);
    const constructionValue = Number(property.constructionValue);
    const acquisitionValue = Number(property.acquisitionValue);
    const acquisitionCosts = Number(property.acquisitionCosts);

    if(!cadastralValue || !constructionValue || !acquisitionValue || !acquisitionCosts) {
        throw new Error('Property data is incomplete');
    }

    // Valor catastral excluido el valor del suelo (valor construcción) prorrateado por el nº de días que ha estado arrendado
    const proratedConstructionValueForRentedDays = constructionValue * (numberOfDaysRented / 365);

    // Valor de adquisición construcción
    let acquisitionConstructionValue = constructionValue / cadastralValue;

    // Valor de adquisición construcción
    acquisitionConstructionValue = (acquisitionValue + acquisitionCosts) * acquisitionConstructionValue;

    // Valor de adquisición satisfecho = (Valor adquisición construcción + Mejoras años anteriores + Mejora año actual)
    const satisfiedAcquisitionValue = acquisitionConstructionValue + previousYearsImprovements + currentYearImprovements;

    // Valor adquisición construcción prorrateado días arrendamiento
    const proratedSatisfiedAcquisitionValue = satisfiedAcquisitionValue * (numberOfDaysRented / 365);

    const amortization = Math.max(proratedConstructionValueForRentedDays * 0.03, proratedSatisfiedAcquisitionValue * 0.03);

    return Number(amortization.toFixed(2));
}

module.exports = {
    calculateTaxReturn
}
