const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");
const House = require("./house.model");
const Flat = require("./flat.model");
const Garage = require("./garage.model");
const Operation = require("./operation.model.js");
const Balance = require("./balance.model.js");
const TaxReturn = require("./taxReturn.model.js");

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
            unique: true,
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
        cadastralValue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        constructionValue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        acquisitionValue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        acquisitionCosts: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        }
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
Property.hasMany(Balance, { foreignKey: 'property_id', onDelete: 'CASCADE', as : 'balances'});
Operation.belongsTo(Property, { foreignKey: 'property_id', as : 'property'});
Balance.belongsTo(Property, { foreignKey: 'property_id', as : 'property'});
TaxReturn.belongsTo(Property, { foreignKey: 'property_id', as : 'property'});

module.exports = Property;
