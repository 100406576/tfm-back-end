const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class Flat extends Model {}

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

module.exports = Flat;
