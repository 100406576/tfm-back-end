const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const documentService = require('../services/document.service');
const { ValidationError } = require('sequelize');

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

            await documentService.createDocument(req.file.originalname, req.file.buffer, req.file.mimetype, req.user.user_id);

            res.status(200).send({ message: `Document "${req.file.originalname}" uploaded successfully` });
        } catch (error) {
            next(error);
        }
    });
};

/*const getDocument = async (req, res, next) => {
    try {
        // Busca el documento en la base de datos
        const document = await Document.findByPk(req.params.document_id);

        // Si el documento no existe, envía un error 404
        if (!document) {
            return res.status(404).send({ message: 'Documento no encontrado.' });
        }

        // Establece el encabezado 'Content-Type' al tipo MIME del documento
        res.setHeader('Content-Type', document.mimetype);

        // Envía los datos del documento en el cuerpo de la respuesta
        res.send(document.data);
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        const documentId = req.params.document_id;

        const document = await Document.findByPk(documentId);

        if (!document) {
            return res.status(404).send({ message: 'Documento no encontrado.' });
        }

        await document.destroy();

        res.status(200).send({ message: 'Documento eliminado con éxito.' });
    } catch (error) {
        next(error);
    }
};*/

module.exports = {
    uploadDocument,
    //getDocument,
    //deleteDocument
}