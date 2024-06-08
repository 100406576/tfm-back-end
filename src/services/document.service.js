const Document = require('../models/document.model');
const  NotFoundError = require('../errors/notFound.error');
const  ForbiddenError = require('../errors/forbidden.error');

const createDocument = async (documentName, data, mimetype, user_id) => {
    const document = await Document.create({
        documentName: documentName,
        data: data,
        mimetype: mimetype,
        user_id: user_id
    });

    return document;
};

const readDocumentByDocumentName = async (documentName) => {
    const document = await Document.findOne({
        where: {
            documentName: documentName
        }
    });

    return document;
};

const readDocumentByDocumentId = async (document_id) => {
    const document = await Document.findByPk(document_id);

    return document;
};

const readDocumentsByUserId = async (user_id) => {
    const documents = await Document.findAll({
        where: {
            user_id: user_id,
        },
        attributes: {
            exclude: ['data']
        }
    });

    return documents;
};

const deleteDocumentByDocumentId = async (document_id) => {
    return await Document.destroy({
        where: {
            document_id: document_id
        }
    });
};

const deleteDocumentsByUserId = async (user_id) => {
    return await Document.destroy({
        where: {
            user_id: user_id
        }
    });
};

const validateDocumentOwnership = async (document_id, user_id) => {
    const document = await readDocumentByDocumentId(document_id);

    if (!document) {
        throw new NotFoundError('Document not found');
    }

    if (document.user_id !== user_id) {
        throw new ForbiddenError('You are not allowed to perform this operation on this document');
    }
}

module.exports = {
    createDocument,
    readDocumentByDocumentId,
    readDocumentByDocumentName,
    readDocumentsByUserId,
    deleteDocumentByDocumentId,
    deleteDocumentsByUserId,
    validateDocumentOwnership
};