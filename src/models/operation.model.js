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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [['income', 'expense']],
                    msg: "The type must be 'income' or 'expense'"
                }
            }
        },
        value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isPositive(value) {
                    if (parseFloat(value) <= 0) {
                        throw new Error('The value must be positive');
                    }
                }
            }
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