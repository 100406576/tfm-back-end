const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class User extends Model {}

User.init(
    {
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            set(value) {
                this.setDataValue('phoneNumber', value === "" ? null : value);
            },
            validate: {
                is: {
                    args: /^[0-9]{9}$/,
                    msg: "The phone number must have 9 numeric digits"
                }
            }
        },
        dni: {
            type: DataTypes.STRING,
            allowNull: true,
            set(value) {
                this.setDataValue('dni', value === "" ? null : value);
            },
            validate: {
                is: {
                    args: /^[0-9]{8}[A-Z]$/i,
                    msg: "The DNI must have 8 digits followed by a letter"
                }
            },
            unique: true,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
            set(value) {
                this.setDataValue('gender', value === "" ? null : value);
            },
            validate: {
                isIn: {
                    args: [['male', 'female']],
                    msg: "The gender must be 'male' or 'female'"
                }
            }
        },
    },
    {
        sequelize,
        modelName: "User",
    }
);

module.exports = User;
