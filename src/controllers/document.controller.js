const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const documentService = require('../services/document.service');
const { ValidationError } = require('sequelize');
const ConflictError = require('../errors/conflict.error');

const uploadDocument = async (req, res, next) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
           next(new ValidationError('No file provided'));
           return;
        }

        try {
            const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new ValidationError('Unsupported file type');
            }

            const documentName = Buffer.from(req.file.originalname, 'binary').toString('utf-8');

            const document = await documentService.readDocumentByDocumentName(documentName);
            if (document) {
                throw new ConflictError('Document with this name already exists');
            }

            await documentService.createDocument(documentName, req.file.buffer, req.file.mimetype, req.user.user_id);

            res.status(200).send({ message: `Document "${documentName}" uploaded successfully` });
        } catch (error) {
            next(error);
        }
    });
};

const readDocumentsOfUser = async (req, res, next) => {
    try {
        const documents = await documentService.readDocumentsByUserId(req.user.user_id);
        res.status(200).send(documents);
    } catch (error) {
        next(error);
    }
};

const readDocument = async (req, res, next) => {
    try {
        await documentService.validateDocumentOwnership(req.params.document_id, req.user.user_id);

        const document = await documentService.readDocumentByDocumentId(req.params.document_id);

        res.setHeader('Content-Type', document.mimetype);

        res.send(document.data);
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        await documentService.validateDocumentOwnership(req.params.document_id, req.user.user_id);

        await documentService.deleteDocumentByDocumentId(req.params.document_id);

        res.status(200).send({ message: 'Document deleted successfully' });
    } catch (error) {
        next(error);
    }
}

const deleteDocumentsOfUser = async (req, res, next) => {
    try {
        await documentService.deleteDocumentsByUserId(req.user.user_id);

        res.status(200).send({ message: 'Documents deleted successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    uploadDocument,
    readDocumentsOfUser,
    readDocument,
    deleteDocument,
    deleteDocumentsOfUser,
}