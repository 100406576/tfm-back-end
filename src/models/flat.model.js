const { DataTypes } = require("sequelize");
const sequelize = require("./index.js");
const Property = require("./property.model");

class Flat extends Property {}

Flat.init(
    {
        numberOfRooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        floorNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hasBalcony: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Flat",
    }
);

Flat.belongsTo(Property, { foreignKey: 'property_id', onDelete: 'CASCADE' });

module.exports = Flat;