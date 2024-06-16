const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class House extends Model {}

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

module.exports = House;

