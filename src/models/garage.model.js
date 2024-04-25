const { DataTypes } = require("sequelize");
const sequelize = require("./index.js");
const Property = require("./property.model");

class Garage extends Property {}

Garage.init(
    {
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Garage",
    }
);

Garage.belongsTo(Property, { foreignKey: 'property_id', onDelete: 'CASCADE' });

module.exports = Garage;