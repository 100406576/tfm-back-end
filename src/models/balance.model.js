const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class Balance extends Model {}

Balance.init(
    {
        balance_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        labels: {
            type: DataTypes.STRING(1234), // reemplace 1234 con la longitud máxima que necesites
            get() {
                return JSON.parse(this.getDataValue('labels'));
            },
            set(value) {
                this.setDataValue('labels', JSON.stringify(value));
            },
        },
        income: {
            type: DataTypes.STRING,
            get() {
                return JSON.parse(this.getDataValue('income'));
            },
            set(value) {
                this.setDataValue('income', JSON.stringify(value));
            },
        },
        expenses: {
            type: DataTypes.STRING,
            get() {
                return JSON.parse(this.getDataValue('expenses'));
            },
            set(value) {
                this.setDataValue('expenses', JSON.stringify(value));
            },
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
        modelName: "Balance"
    }
);

module.exports = Balance;