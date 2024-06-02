const Document = require('../models/document.model');

const createDocument = async (documentName, data, mimetype, userId) => {
    const document = await Document.create({
        documentName: documentName,
        data: data,
        mimetype: mimetype,
        user_id: userId
    });

    return document;
};

module.exports = {
    createDocument
};