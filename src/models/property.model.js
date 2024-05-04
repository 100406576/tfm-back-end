const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");
const House = require("./house.model");
const Flat = require("./flat.model");
const Garage = require("./garage.model");

class Property extends Model {}

Property.init(
    {
        property_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        propertyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cadastralReference: {
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

Property.hasOne(House,  { foreignKey: 'property_id', onDelete: 'CASCADE', as : 'houseDetails' });
Property.hasOne(Flat, { foreignKey: 'property_id', onDelete: 'CASCADE', as : 'flatDetails'});
Property.hasOne(Garage, { foreignKey: 'property_id', onDelete: 'CASCADE', as : 'garageDetails'});

module.exports = Property;
