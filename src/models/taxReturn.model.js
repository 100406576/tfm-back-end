const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class TaxReturn extends Model {}

TaxReturn.init(
    {
        taxReturn_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fiscalYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        taxableIncome: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        deductibleExpenses: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        amortization: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        property_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Properties',
              key: 'property_id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: "TaxReturn"
    }
);

module.exports = TaxReturn;
