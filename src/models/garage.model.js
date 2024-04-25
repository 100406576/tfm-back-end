const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class Garage extends Model {}

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

module.exports = Garage;