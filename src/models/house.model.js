const { DataTypes } = require("sequelize");
const sequelize = require("./index.js");
const Property = require("./property.model");

class House extends Property {}

House.init(
    {
        numberOfRooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hasGarden: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "House",
    }
);

House.belongsTo(Property, { foreignKey: 'property_id', onDelete: 'CASCADE' });

module.exports = House;
