const { Model, DataTypes } = require("sequelize");
const sequelize = require("./index.js");

class Document extends Model {}

Document.init(
    {
        document_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        data: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false
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
        modelName: "Document"
    }
);

module.exports = Document;