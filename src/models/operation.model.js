const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class Operation extends Model {}

Operation.init(
    {
        operation_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        property_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Properties',
              key: 'property_id',
            }
        },
    },
    {
        sequelize,
        modelName: "Operation"
    }
);

module.exports = Operation;