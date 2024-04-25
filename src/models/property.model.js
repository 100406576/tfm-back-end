const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class Property extends Model {}

Property.init(
    {
        property_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        property_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'user_id',
            }
        },
    },
    {
        sequelize,
        modelName: "Property"
    }
);

module.exports = Property;
