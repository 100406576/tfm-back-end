const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");
const House = require("./house.model");
const Flat = require("./flat.model");
const Garage = require("./garage.model");
const Operation = require("./operation.model.js");

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
            allowNull: false,
            set(value) {
                this.setDataValue('propertyName', value === "" ? null : value);
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('address', value === "" ? null : value);
            },
        },
        cadastralReference: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('cadastralReference', value === "" ? null : value);
            },
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
Property.hasMany(Operation, { foreignKey: 'property_id', onDelete: 'CASCADE', as : 'operations'});

module.exports = Property;
